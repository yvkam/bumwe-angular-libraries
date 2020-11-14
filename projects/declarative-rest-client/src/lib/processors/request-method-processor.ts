import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter, flatMap, map, mergeMap, tap, timeout} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AbstractRestClient} from '../abstract-rest-client';
import {metadataKeySuffix, ParameterMetadata} from '../decorators/parameters';
import {GenericRequestMethodArgs, RequestMethod, RequestMethodArgs} from '../decorators/request-methods';
import {buildUrl} from './url-builder';
import {buildHeaders} from './headers-builder';
import {buildQueryParams} from './query-params-builder';
import {buildBody} from './body-builder';
import 'reflect-metadata';

export function requestMethodProcessor(method?: RequestMethod) {
  return (annotationArgs: string | RequestMethodArgs) => {
    return (target: AbstractRestClient, propertyKey: string, descriptor: any) => {

      descriptor.value = function(...targetMethodArgs: any[]) {

        const metadata = getMetadata(target, propertyKey, targetMethodArgs);
        const path = getPath(annotationArgs);
        const requestMethod = getRequestMethod(method, annotationArgs);
        const body = buildBody(metadata.body, metadata.plainBody);
        const url = buildUrl(this.getBaseUrl(), path, metadata.pathParams);
        const params = buildQueryParams(url, metadata.queryParams, metadata.plainQueryParams);
        const headers = buildHeaders(this.getDefaultHeaders(), descriptor.headers, metadata.header, annotationArgs);
        const timeoutValue = getTimeout(descriptor, annotationArgs);
        const responseAuthHeaders = getResponseAuthHeaders(annotationArgs);
        const mapper = getMapper(descriptor);
        const emitters = descriptor.emitters || [];

        // Make the HTTP request
        const response = sendRequest.call(this, requestMethod, url, body, params, headers, {
          timeoutValue,
          responseAuthHeaders
        }) as Observable<HttpResponse<any>>;

        return applyOnEmitDecorator(emitters, applyMapDecorator(mapper, annotationArgs, response));
      };

      return descriptor;
    };
  };
}

function applyMapDecorator(mapper: (resp: any) => any,
                           annotationArgs,
                           response: Observable<HttpResponse<any>>): Observable<any> {
  const fullResponse = annotationArgs ? annotationArgs.fullResponse : false;
  return response.pipe(
    filter(r => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r.clone({body: mapper(r.body)})),
    map((r: HttpResponse<any>) => fullResponse ? r : r.body)
  );
}

function applyOnEmitDecorator(emitters, response: Observable<HttpResponse<any>>) {
  return emitters.reduce((resp, handler) => handler(resp), response);
}

function addRequestInterceptor(request: HttpRequest<unknown>): Observable<HttpRequest<any>> {
  const interceptedRequest$ = this.requestInterceptor(request);
  return interceptedRequest$ ? interceptedRequest$ : of(request);
}

function addResponseInterceptor(httpResponse: HttpResponse<any>): Observable<HttpResponse<any>> {
  const interceptedResponse$ = this.responseInterceptor(httpResponse);
  return interceptedResponse$ || of(httpResponse);
}

function sendRequest(method: RequestMethod,
                     url: string,
                     body,
                     params: HttpParams,
                     headers: HttpHeaders,
                     options?: { timeoutValue?: number, responseAuthHeaders?: string[] }): Observable<HttpEvent<any>> {

  const request = new HttpRequest(method, url, body, {
    headers,
    params,
    withCredentials: this.isWithCredentials()
  });

  return addRequestInterceptor.call(this, request).pipe(
    mergeMap((req: HttpRequest<any>) => (this.httpClient as HttpClient).request(req)),
    timeout(options.timeoutValue),
    tap((r: HttpResponse<any>) => options.responseAuthHeaders.forEach(token => sessionStorage.setItem(token, r.headers.get(token)))),
    flatMap(e => addResponseInterceptor.call(this, e) as Observable<HttpResponse<any>>),
  );

}

function getMapper(descriptor: any): (resp) => any {
  if (descriptor.mapper) {
    return descriptor.mapper;
  }

  return x => x;
}

function getResponseAuthHeaders(options: any): string[] {
  return options ? options.responseAuthHeaders || [] : [];
}

function getTimeout(descriptor: any, options: any): number {
  if (descriptor.timeout) {
    return descriptor.timeout;
  }

  if (options && options.timeout) {
    return options.timeout;
  }

  return 30000;
}

function getRequestMethod(method: RequestMethod, request: string | RequestMethodArgs) {
  return method || (request as GenericRequestMethodArgs).method;
}

function getPath(request: string | RequestMethodArgs) {
  return typeof request === 'string' ? request : request.path;
}

function getMetadata(target: AbstractRestClient, propertyKey: string, methodArgs: any[]) {
  return {
    pathParams: enrichMetadata(target[propertyKey + metadataKeySuffix.pathParam], methodArgs),
    queryParams: enrichMetadata(target[propertyKey + metadataKeySuffix.queryParam], methodArgs),
    plainQueryParams: enrichMetadata(target[propertyKey + metadataKeySuffix.plainQuery], methodArgs),
    body: enrichMetadata(target[propertyKey + metadataKeySuffix.body], methodArgs),
    plainBody: enrichMetadata(target[propertyKey + metadataKeySuffix.plainBody], methodArgs),
    header: enrichMetadata(target[propertyKey + metadataKeySuffix.header], methodArgs)
  };
}

function enrichMetadata(metadata: ParameterMetadata[], methodArgs: any[]): ParameterMetadata[] {
  if (!metadata) {
    return [];
  }

  if (!methodArgs) {
    return metadata;
  }

  return metadata.map(m => Object.assign({}, m, {value: methodArgs[m.index] || m.value}));
}

