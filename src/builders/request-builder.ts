import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { map, timeout, filter, mergeMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RestClient } from '../rest-client';
import { Format } from '../decorators/parameters';

export function methodBuilder( method: string ) {
  return function ( url: string ) {
    return function ( target: RestClient, propertyKey: string, descriptor: any ) {

      let pPath       = target[ `${propertyKey}_Path_parameters` ];
      let pQuery      = target[ `${propertyKey}_Query_parameters` ];
      let pPlainQuery = target[ `${propertyKey}_PlainQuery_parameters` ];
      let pBody       = target[ `${propertyKey}_Body_parameters` ];
      let pPlainBody  = target[ `${propertyKey}_PlainBody_parameters` ];
      let pHeader     = target[ `${propertyKey}_Header_parameters` ];

      descriptor.value = function ( ...args: any[] ) {
        // Body
        let body: any = null;
        if ( pBody ) {
          if ( pBody.length > 1 ) {
            throw new Error( 'Only one @Body is allowed' );
          }
          let value = args[ pBody[ 0 ].parameterIndex ];
          if ( !value && pBody[ 0 ].value ) {
            value = pBody[ 0 ].value;
          }
          body = JSON.stringify( value );
        }
        if ( pPlainBody ) {
          if ( pPlainBody.length > 1 ) {
            throw new Error( 'Only one @Body is allowed' );
          }
          let value = args[ pPlainBody[ 0 ].parameterIndex ];
          if ( !value && pPlainBody[ 0 ].value ) {
            value = pPlainBody[ 0 ].value;
          }
          body = value;
        }

        // Path
        let resUrl: string = url;
        if ( pPath ) {
          for ( let k in pPath ) {
            if ( pPath.hasOwnProperty( k ) ) {
              let value: any = args[ pPath[ k ].parameterIndex ];
              if ( !value && pPath[ k ].value ) {
                value = pPath[ k ].value;
              }
              if ( value && value !== null ) {
                resUrl = resUrl.replace( '{' + pPath[ k ].key + '}', value );
              } else {
                throw new Error( 'Missing path variable \'' + pPath[ k ].key + '\' in url ' + url );
              }
            }
          }
        }
        if ( this.getBaseUrl() !== null ) {
          let baseUrl = this.getBaseUrl();
          if ( baseUrl.indexOf( '/' ) === baseUrl.length - 1 && resUrl.indexOf( '/' ) === 0 ) {
            baseUrl = baseUrl.substring( 0, 1 );
          }
          resUrl = baseUrl + resUrl;
        }

        // Query
        let search: HttpParams = new HttpParams();
        if ( pQuery ) {
          pQuery
            .filter( ( p: any ) => args[ p.parameterIndex ] || p.value ) // filter out optional parameters
            .forEach( ( p: any ) => {
              let key        = p.key;
              let value: any = args[ p.parameterIndex ];

              if ( !value && p.value ) {
                value = p.value;
              }

              // if the value is a instance of Object, we stringify it
              if ( Array.isArray( value ) ) {
                switch ( p.format ) {
                  case Format.CSV:
                    value = value.join( ',' );
                    break;
                  case Format.SSV:
                    value = value.join( ' ' );
                    break;
                  case Format.TSV:
                    value = value.join( '\t' );
                    break;
                  case Format.PIPES:
                    value = value.join( '|' );
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join( ',' );
                }
              } else if ( value instanceof Object ) {
                value = JSON.stringify( value );
              }
              if ( Array.isArray( value ) ) {
                value.forEach( v => search = search.append( key, v ) );
              } else {
                search = search.set( key, value );
              }
            } );
        }
        if ( pPlainQuery ) {
          pPlainQuery
            .filter( ( p: any ) => args[ p.parameterIndex ] ) // filter out optional parameters
            .forEach( ( p: any ) => {
              let value: any = args[ p.parameterIndex ];

              if ( value instanceof Object ) {
                Object.keys(value).forEach( key => search = search.append( key, value[key] ) );
              } else {
                throw new Error( 'Value is not an Object' );
              }
            } );
        }

        // Headers
        // set class default headers
        let headers: HttpHeaders = new HttpHeaders( this.getDefaultHeaders() );

        // set method specific headers
        for ( let k in descriptor.headers ) {
          if ( descriptor.headers.hasOwnProperty( k ) ) {
            if ( headers.has( k ) ) {
              headers = headers.append( k, descriptor.headers[ k ] + '' );
            } else {
              headers = headers.set( k, descriptor.headers[ k ] + '' );
            }
          }
        }
        // set parameter specific headers
        if ( pHeader ) {
          for ( let k in pHeader ) {
            if ( pHeader.hasOwnProperty( k ) ) {
              let value: any = args[ pHeader[ k ].parameterIndex ];
              if ( !value && pHeader[ k ].value ) {
                value = pHeader[ k ].value;
              }
              if ( Array.isArray( value ) ) {
                switch ( pHeader[ k ].format ) {
                  case Format.CSV:
                    value = value.join( ',' );
                    break;
                  case Format.SSV:
                    value = value.join( ' ' );
                    break;
                  case Format.TSV:
                    value = value.join( '\t' );
                    break;
                  case Format.PIPES:
                    value = value.join( '|' );
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join( ',' );
                }
              }
              if ( Array.isArray( value ) ) {
                value.forEach( v => headers = headers.append( pHeader[ k ].key, v + '' ) );
              } else {
                headers = headers.append( pHeader[ k ].key, value + '');
              }
            }
          }
        }

        // intercept the request
        let request = new HttpRequest( method, resUrl, body, {
          headers: headers,
          params: search,
          withCredentials: this.isWithCredentials()
        } );

        let intercepted: HttpRequest<any>|Observable<HttpRequest<any>> = this.requestInterceptor( request );

        if (intercepted instanceof HttpRequest) {
          intercepted = of(intercepted);
        }

        if (!(intercepted instanceof Observable)) {
          throw new Error( 'RequestInterceptor should return HttpRequest|Observable<HttpRequest' );
        }

        // make the request and store the observable for later transformation
        let observable: Observable<HttpEvent<any>> = intercepted.pipe(
          mergeMap(req => (<HttpClient>this.httpClient).request(req))
        );

        // intercept the response
        observable = this.responseInterceptor( observable );

        // map resp.body
        observable = observable.pipe(
          filter(resp => resp.type === HttpEventType.Response),
          map((resp: HttpResponse<any>) => resp.body)
        );

        // mapper
        if ( descriptor.mappers ) {
          descriptor.mappers.forEach( ( mapper: ( resp: any ) => any ) => {
            observable = observable.pipe(map( mapper ));
          } );
        }

        // timeout
        if ( descriptor.timeout ) {
          descriptor.timeout.forEach( ( duration: number ) => {
            observable = observable.pipe(timeout( duration ));
          } );
        }

        // emitters
        if ( descriptor.emitters ) {
          descriptor.emitters.forEach( ( handler: ( resp: Observable<any> ) => Observable<any> ) => {
            observable = handler( observable );
          } );
        }

        return observable;
      };

      return descriptor;
    };
  };
}
