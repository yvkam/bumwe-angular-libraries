import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter, map, mergeMap, timeout} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RestClient} from '../rest-client';
import {Format, metadataKeySuffix, ParameterMetadata} from '../decorators/parameters';


function getBody(metadata: ParameterMetadata[], plain: boolean) {
  if (!metadata) {
    return undefined;
  }

  if (metadata.length > 1) {
    throw new Error('Only one @Body is allowed');
  }

  return plain ? metadata[0] : JSON.stringify(metadata[0]);
}

function buildFullUrl(baseUrl: string, path: string) {
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

function replaceQueryParams(fullUrl: string, queryParamsMetadata: ParameterMetadata[], args: any[]): HttpParams {
  let search: HttpParams = new HttpParams();

  if (!queryParamsMetadata) {
    return search;
  }

  queryParamsMetadata
    .filter((p: any) => args[p.parameterIndex] || p.value) // filter out optional parameters
    .forEach((p: any) => {
      const key = p.key;
      const value: any = args[p.parameterIndex] || p.value;

      // if the value is a instance of Object, we stringify it
      const rawValue = stringifyQueryParams(value, p.format);
      const rawValueArray = Array.isArray(rawValue) ? rawValue : [rawValue];
      rawValueArray.forEach(v => search = search.append(key, v));
    });

  return search;
}

function stringifyQueryParams(value: any, format: string): string | string[] {
  if (Array.isArray(value)) {
    switch (format) {
      case Format.SSV:
        return value.join(' ');
      case Format.TSV:
        return value.join('\t');
      case Format.PIPES:
        return value.join('|');
      case Format.MULTI:
        return value;
      case Format.CSV:
      default:
        return value.join(',');
    }
  }

  if (value instanceof Object) {
    return JSON.stringify(value);
  }

  return value;
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

export function methodBuilder(method: string) {
  return (path: string) => {
    return (target: RestClient, propertyKey: string, descriptor: any) => {

      descriptor.value = function(...methodArgs: any[]) {

        const pathParamsMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.pathParam], methodArgs);
        const queryParamsMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.queryParam], methodArgs);
        const plainQueryParamsMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.plainQuery], methodArgs);
        const bodyMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.body], methodArgs);
        const plainBodyMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.plainBody], methodArgs);
        const headerMetadata = enrichMetadata(target[propertyKey + metadataKeySuffix.header], methodArgs);

        // Body
        const body: any = getBody(bodyMetadata || plainBodyMetadata, !!plainBodyMetadata);

        // PathParamz
        let fullUrl: string = buildFullUrl(this.getBaseUrl(), path);
        fullUrl = replacePathParams(fullUrl, pathParamsMetadata);
        // fullUrl = replaceQueryParams(fullUrl, queryParamsMetadata, methodArgs);
        // fullUrl = replacePlainQueryParams(fullUrl, pathParamsMetadata, methodArgs);

        // QueryParam
        let search: HttpParams = new HttpParams();
        if (queryParamsMetadata) {
          queryParamsMetadata
            .filter((p: any) => methodArgs[p.parameterIndex] || p.value) // filter out optional parameters
            .forEach((p: any) => {
              const key = p.key;
              let value: any = methodArgs[p.parameterIndex];

              if (!value && p.value) {
                value = p.value;
              }

              // if the value is a instance of Object, we stringify it
              if (Array.isArray(value)) {
                switch (p.format) {
                  case Format.CSV:
                    value = value.join(',');
                    break;
                  case Format.SSV:
                    value = value.join(' ');
                    break;
                  case Format.TSV:
                    value = value.join('\t');
                    break;
                  case Format.PIPES:
                    value = value.join('|');
                    break;
                  case Format.MULTI:
                    break;
                  default:
                    value = value.join(',');
                }
              } else if (value instanceof Object) {
                value = JSON.stringify(value);
              }
              if (Array.isArray(value)) {
                value.forEach(v => search = search.append(key, v));
              } else {
                search = search.set(key, value);
              }
            });
        }
        if (plainQueryParamsMetadata) {
          plainQueryParamsMetadata
            .filter((p: any) => methodArgs[p.parameterIndex]) // filter out optional parameters
            .forEach((p: any) => {
              let value: any = methodArgs[p.parameterIndex];

              if (value instanceof Object) {
                Object.keys(value).forEach(key => search = search.append(key, value[key]));

              } else if (typeof value === 'string') {
                if (value.charAt(0) === '?') {
                  value = value.substr(1);
                }

                if (typeof value === 'string') {
                  value.split('&').forEach(pair => {
                    const [k, v] = pair.split('=');
                    search = search.append(k, v);
                  });
                }

              } else {
                throw new Error('Value type is not correct');
              }
            });
        }

        // Headers
        // set class default headers
        let headers: HttpHeaders = new HttpHeaders(this.getDefaultHeaders());

        // set method specific headers
        for (const k in descriptor.headers) {
          if (descriptor.headers.hasOwnProperty(k)) {
            if (headers.has(k)) {
              headers = headers.append(k, descriptor.headers[k] + '');
            } else {
              headers = headers.set(k, descriptor.headers[k] + '');
            }
          }
        }
        // set parameter specific headers
        if (headerMetadata) {
          for (const k in headerMetadata) {
            if (headerMetadata.hasOwnProperty(k)) {
              let value: any = methodArgs[headerMetadata[k].index];
              if (!value && headerMetadata[k].value) {
                value = headerMetadata[k].value;
              }
              if (Array.isArray(value)) {
                switch (headerMetadata[k].format) {
                  case Format.CSV:
                    value = value.join(',');
                    break;
                  case Format.SSV:
                    value = value.join(' ');
                    break;
                  case Format.TSV:
                    value = value.join('\t');
                    break;
                  case Format.PIPES:
                    value = value.join('|');
                    break;
                  case Format.MULTI:
                    break;
                  default:
                    value = value.join(',');
                }
              }
              if (Array.isArray(value)) {
                value.forEach(v => headers = headers.append(headerMetadata[k].key, v + ''));
              } else {
                headers = headers.append(headerMetadata[k].key, value + '');
              }
            }
          }
        }

        // intercept the request
        const request = new HttpRequest(method, fullUrl, body, {
          headers,
          params: search,
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
        let observable: Observable<HttpEvent<any>> = intercepted.pipe(
          mergeMap(req => (this.httpClient as HttpClient).request(req))
        );

        // intercept the response
        observable = this.responseInterceptor(observable);

        // map resp.body
        observable = observable.pipe(
          filter(resp => resp.type === HttpEventType.Response),
          map((resp: HttpResponse<any>) => resp.body)
        );

        // mapper
        if (descriptor.mappers) {
          descriptor.mappers.forEach((mapper: (resp: any) => any) => {
            observable = observable.pipe(map(mapper));
          });
        }

        // timeout
        if (descriptor.timeout) {
          descriptor.timeout.forEach((duration: number) => {
            observable = observable.pipe(timeout(duration));
          });
        }

        // emitters
        if (descriptor.emitters) {
          descriptor.emitters.forEach((handler: (resp: Observable<any>) => Observable<any>) => {
            observable = handler(observable);
          });
        }

        return observable;
      };

      return descriptor;
    };
  };
}
