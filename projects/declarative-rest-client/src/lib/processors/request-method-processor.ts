import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter, flatMap, map, mergeMap, tap, timeout} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RestClient} from '../rest-client';
import {metadataKeySuffix, ParameterMetadata} from '../decorators/parameters';
import {GenericRequestMethodArgs, RequestMethod, RequestMethodArgs} from '../decorators/request-methods';
import {buildUrl} from './url-builder';
import {buildHeaders} from './headers-builder';
import {buildQueryParams} from './query-params-builder';
import {buildBody} from './body-builder';

export function requestMethodProcessor(method?: RequestMethod) {
  return (annotationArgs: string | RequestMethodArgs) => {
    return (target: RestClient, propertyKey: string, descriptor: any) => {

      descriptor.value = function(...targetMethodArgs: any[]) {

        const metadata = getMetadata(target, propertyKey, targetMethodArgs);
        const path = getPath(annotationArgs);
        const requestMethod = getRequestMethod(method, annotationArgs);
        const body = buildBody(metadata.body, metadata.plainBody);
        const url = buildUrl(this.getBaseUrl(), path, metadata.pathParams);
        const params = buildQueryParams(url, metadata.queryParams, metadata.plainQueryParams);
        const headers = buildHeaders(this.getDefaultHeaders(), descriptor.headers, metadata.header, annotationArgs as RequestMethodArgs);

        let resp = sendRequest.call(this, requestMethod, url, body, params, headers);

        interceptTokens(resp, annotationArgs as RequestMethodArgs);
        resp = addMappers(descriptor, resp);

        resp = addTimeout(resp, descriptor, annotationArgs as RequestMethodArgs);

        resp = addOneEmit(descriptor, resp);

        return resp;
      };

      return descriptor;
    };
  };
}

function addRequestInterceptor(request: HttpRequest<unknown>): Observable<HttpRequest<any>> {
  const interceptedRequest = this.requestInterceptor(request);
  return interceptedRequest ? interceptedRequest : of(request);
}

function processEvent(httpEvent: Observable<HttpEvent<any>>): Observable<HttpEvent<any>> {
  return httpEvent.pipe(
    flatMap(e => e instanceof HttpResponse ? processResponse.call(this, e) as Observable<HttpResponse<any>> : httpEvent)
  );
}

function processResponse(httpResponse: HttpResponse<any>): Observable<HttpResponse<any>> {
  const interceptedResponse = this.responseInterceptor(httpResponse);
  const response = interceptedResponse  || of(httpResponse);
  return response.pipe(map((resp: HttpResponse<any>) => resp.body));
}

function sendRequest(method: RequestMethod,
                     url: string,
                     body,
                     params: HttpParams,
                     headers: HttpHeaders): Observable<HttpEvent<any>> {

  const request = new HttpRequest(method, url, body, {
    headers,
    params,
    withCredentials: this.isWithCredentials()
  });

  // make the Request and store the httpEvent for later transformation
  const httpEvent = addRequestInterceptor.call(this, request).pipe(
    mergeMap((req: HttpRequest<any>) => (this.httpClient as HttpClient).request(req)),
  );

  return processEvent.call(this, httpEvent);
}

function interceptTokens(resp: Observable<HttpEvent<any>>, options: RequestMethodArgs) {
  if (options && options.tokensToIntercept) {
    resp.pipe(
      filter((r: HttpEvent<any>) => r.type === HttpEventType.Response),
      tap((r: HttpResponse<any>) => options.tokensToIntercept.forEach(token => sessionStorage.setItem(token, r.headers.get(token))
      ))
    );
  }
}

function addMappers(descriptor: any, resp) {
  if (descriptor.mappers) {
    descriptor.mappers.forEach((mapper: (resp: any) => any) => {
      resp = resp.pipe(map(mapper));
    });
  }
  return resp;
}

function addTimeout(resp, descriptor: any, options: RequestMethodArgs) {
  if (descriptor.timeout || (options && options.timeout)) {
    [].concat(descriptor.timeout || options.timeout).forEach((duration: number) => {
      resp = resp.pipe(timeout(duration));
    });
  }
  return resp;
}

function addOneEmit(descriptor: any, resp) {
  if (descriptor.emitters) {
    descriptor.emitters.forEach((handler: (resp: Observable<any>) => Observable<any>) => {
      resp = handler(resp);
    });
  }
  return resp;
}

function getRequestMethod(method: RequestMethod, request: string | RequestMethodArgs) {
  return method || (request as GenericRequestMethodArgs).method;
}

function getPath(request: string | RequestMethodArgs) {
  return typeof request === 'string' ? request : request.path;
}

function getMetadata(target: RestClient, propertyKey: string, methodArgs: any[]) {
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

