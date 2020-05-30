import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * RestClient class.
 *
 */
export abstract class RestClient {
  protected constructor(
    protected httpClient: HttpClient
  ) {}

  public getServiceId(): string {
    return;
  }

  public getBaseUrl(): string {
    return;
  }

  public getDefaultHeaders(): object {
    return;
  }

  public isWithCredentials(): boolean {
    return;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param request - request object
   */
  protected requestInterceptor(request: HttpRequest<any>): HttpRequest<any>|Observable<HttpRequest<any>> {
    return request;
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param response - response object
   * @returns res - transformed response object
   */
  protected responseInterceptor(response: Observable<HttpResponse<any>>): Observable<any> {
    return response;
  }
}
