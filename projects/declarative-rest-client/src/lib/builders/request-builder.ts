import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter, map, mergeMap, tap, timeout} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RestClient} from '../rest-client';
import {FORMAT, metadataKeySuffix, ParameterMetadata} from '../decorators/parameters';
import {RequestMethod, RequestMethodOptions} from '../decorators/request-methods';

export function methodBuilder(method?: RequestMethod) {
  return (request: string | RequestMethodArgs, options?: RequestMethodOptions) => {
    return (target: RestClient, propertyKey: string, descriptor: any) => {

      descriptor.value = function(...methodArgs: any[]) {

        const path = typeof request === 'string' ? request : request.path;
        const httpRequestMethod = method || (request as RequestMethodArgs).method;
        const metadata = getMetadata(target, propertyKey, methodArgs);
        const body = getBody(metadata.body, metadata.plainBody);
        const url = buildUrl(this.getBaseUrl(), path, metadata.pathParams);
        const params = setQueryParams(url, metadata.queryParams, metadata.plainQueryParams);
        const headers: HttpHeaders = buildHeaders(this.getDefaultHeaders(), descriptor.headers, metadata.header, options);

        // send and intercept the request
        let resp = sendRequest.apply(this, [httpRequestMethod, url, body, params, headers]);

        // intercept tokens
        if (options && options.tokensToIntercept) {
          resp.pipe(
            filter((r: HttpEvent<any>) => r.type === HttpEventType.Response),
            tap((r: HttpResponse<any>) => options.tokensToIntercept.forEach(token => sessionStorage.setItem(token, r.headers.get(token))
            ))
          );
        }

        // mapper
        if (descriptor.mappers) {
          descriptor.mappers.forEach((mapper: (resp: any) => any) => {
            resp = resp.pipe(map(mapper));
          });
        }

        // timeout
        if (descriptor.timeout || (options && options.timeout)) {
          [].concat(descriptor.timeout || options.timeout).forEach((duration: number) => {
            resp = resp.pipe(timeout(duration));
          });
        }

        // emitters
        if (descriptor.emitters) {
          descriptor.emitters.forEach((handler: (resp: Observable<any>) => Observable<any>) => {
            resp = handler(resp);
          });
        }

        return resp;
      };

      return descriptor;
    };
  };
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

  let intercepted: HttpRequest<any> | Observable<HttpRequest<any>> = this.requestInterceptor(request);

  if (intercepted instanceof HttpRequest) {
    intercepted = of(intercepted);
  }

  if (!(intercepted instanceof Observable)) {
    throw new Error('RequestInterceptor should return HttpRequest|Observable<HttpRequest');
  }

  // make the request and store the observable for later transformation
  const observable = intercepted.pipe(
    mergeMap(req => (this.httpClient as HttpClient).request(req)),
  );

  // handle the response
  return this.responseInterceptor(observable).pipe(
    filter((resp: any) => resp.type === HttpEventType.Response),
    map((resp: HttpResponse<any>) => resp.body)
  );
}

function getBody(bodyMetadata: ParameterMetadata[], plainBodyMetadata: ParameterMetadata[]) {
  const metadata = bodyMetadata || plainBodyMetadata;
  const plain = plainBodyMetadata && plainBodyMetadata.length > 0;

  if (!metadata) {
    return undefined;
  }

  if (metadata.length > 1) {
    throw new Error('Only one @body is allowed');
  }

  const value = metadata[0] ? metadata[0].value : undefined;

  return plain ? value : JSON.stringify(value);
}

function buildFullUrlTemplate(baseUrl: string, path: string) {
  if (!baseUrl) {
    return path;
  }

  // Check double slash conflict during the join of the baseUrl and path
  // TODO: a more robust implementation
  if (baseUrl.indexOf('/') === baseUrl.length - 1 && path.indexOf('/') === 0) {
    return baseUrl.substring(0, 1) + path;
  }

  return baseUrl + path;
}

function buildUrl(baseUrl: string, path: string, pathParamsMetadata: ParameterMetadata[]) {
  const urlTemplate = buildFullUrlTemplate(baseUrl, path);
  return replacePathParams(urlTemplate, pathParamsMetadata);
}

function replacePathParams(urlTemplate: string, metadata: ParameterMetadata[]): string {
  let url = urlTemplate;

  if (!metadata) {
    return url;
  }

  metadata.forEach(m => url = replacePathParam(url, m.key, m.value));
  return url;
}

function replacePathParam(url: string, key: string, value: string) {
  if (!value) {
    throw new Error('Missing path variable \'' + key + '\' in path ' + url);
  }
  return url.replace('{' + key + '}', value);
}

function setQueryParams(url: string, queryParamsMetadata: ParameterMetadata[], plainQueryParamsMetadata: ParameterMetadata[]): HttpParams {
  let queryParams: HttpParams = new HttpParams();

  if (!queryParamsMetadata) {
    return queryParams;
  }

  queryParamsMetadata
    .filter(m => m.value) // filter out optional parameters
    .forEach(m => {
      const value = stringifyQueryParams(m.value, m.format);
      const values = Array.isArray(value) ? value : [value];
      values.forEach(v => queryParams = queryParams.append(m.key, v));
    });

  return replacePlainQueryParams(url, plainQueryParamsMetadata, queryParams);
}

function stringifyQueryParams(value: any, format: string) {
  if (Array.isArray(value)) {
    return formatData(value, format);
  }

  if (value instanceof Object) {
    return JSON.stringify(value);
  }

  return value;
}

function formatData(value, format: string) {
  switch (format) {
    case FORMAT.SSV:
      return value.join(' ');
    case FORMAT.TSV:
      return value.join('\t');
    case FORMAT.PIPES:
      return value.join('|');
    case FORMAT.MULTI:
      return value;
    case FORMAT.CSV:
    default:
      return value.join(',');
  }
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

function removeLeadingQuestionMark(value: string) {
  return value.charAt(0) === '?' ? value.substr(1) : value;
}

function replacePlainQueryParams(fullUrl: string, metadata: ParameterMetadata[], httpParams: HttpParams): HttpParams {
  let finalHttpParams = httpParams;

  if (!metadata) {
    return finalHttpParams;
  }
  metadata
    .filter(m => m.value) // filter out optional parameters
    .forEach(m => {
      const value: any = m.value;

      if (value instanceof Object) {
        Object.keys(value)
          .forEach(key => finalHttpParams = finalHttpParams.append(key, value[key]));
      } else if (typeof value === 'string') {
        removeLeadingQuestionMark(value).split('&')
          .map(pair => pair.split('='))
          .forEach(([k, v]) => finalHttpParams = finalHttpParams.append(k, v));

      } else {
        throw new Error('Value type is not correct');
      }
    });

  return finalHttpParams;
}

function buildHeaders(classLevelHeaders,
                      methodLevelHeaders,
                      headerMetadata: ParameterMetadata[],
                      options?: RequestMethodOptions): HttpHeaders {

  let headers = new HttpHeaders(classLevelHeaders);

  // set method specific headers
  for (const key in methodLevelHeaders) {
    if (methodLevelHeaders.hasOwnProperty(key)) {
      if (headers.has(key)) {
        headers = headers.append(key, methodLevelHeaders[key] + '');
      } else {
        headers = headers.set(key, methodLevelHeaders[key] + '');
      }
    }
  }

  // set options headers
  if (options) {
    if (options.consumes && options.consumes.length > 0) {
      headers = headers.set('accept', options.consumes.join(',') + '');
    }

    if (options.produces && options.produces.length > 0) {
      headers = headers.set('content-type', options.produces.join(',') + '');
    }

    if (options.tokensToSend && options.tokensToSend.length > 0) {
      options.tokensToSend
        .map(t => [t, sessionStorage.getItem(t)])
        .filter(([k, v]) => !!v)
        .forEach(([k, v]) => headers = headers.set(k, v + ''));
    }
  }


  // set parameter specific headers
  if (headerMetadata) {
    for (const k in headerMetadata) {
      if (headerMetadata.hasOwnProperty(k)) {
        let value: any = headerMetadata[k].value;
        if (Array.isArray(value)) {
          value = formatData(value, headerMetadata[k].format);
        }
        value = Array.isArray(value) ? value : [value];
        value.forEach(v => headers = headers.append(headerMetadata[k].key, v + ''));
      }
    }
  }

  return headers;
}

export interface RequestMethodArgs {
  path: string;
  method: RequestMethod;
}

