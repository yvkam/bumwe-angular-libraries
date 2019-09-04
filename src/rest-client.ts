import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Angular 7 RestClient class.
 *
 * @class RestClient
 * @constructor
 */
export class RestClient {
  public constructor(
    protected httpClient: HttpClient
  ) {}

  public getServiceId(): string {
    return null;
  }

  public getBaseUrl(): string {
    return null;
  }

  public getDefaultHeaders(): Object {
    return null;
  }

  public isWithCredentials(): boolean {
    return false;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param {HttpRequest} request - request object
   */
  protected requestInterceptor(request: HttpRequest<any>): HttpRequest<any>|Observable<HttpRequest<any>> {
    return request;
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param {HttpResponse} response - response object
   * @returns {any} res - transformed response object
   */
  protected responseInterceptor(response: Observable<HttpResponse<any>>): Observable<any> {
    return response;
  }
}
