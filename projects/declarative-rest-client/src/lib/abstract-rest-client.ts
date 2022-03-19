import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

export abstract class AbstractRestClient {

  protected constructor(protected httpClient: HttpClient) {}

  protected getBaseUrl(): string {
    return;
  }

  protected getDefaultHeaders(): { [header: string]: string | string[]; } {
    return;
  }

  protected isWithCredentials(): boolean {
    return;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param request - Request object
   */
  protected requestInterceptor(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return;
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param response - response object
   * @returns res - transformed response object
   */
  protected responseInterceptor(response: HttpResponse<any>): Observable<HttpResponse<any>> {
    return;
  }
}
