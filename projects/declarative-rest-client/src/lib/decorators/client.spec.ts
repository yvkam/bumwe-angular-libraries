import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { GET } from './request-methods';
import { Client } from './client';

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request<R>(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

@Client({
  serviceId: 'customer-service',
  baseUrl: '/api/v1/customers',
  headers: {
    'content-type': 'application/json'
  }
})
// @ts-ignore
class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET('/test')
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

describe('@Client', () => {

  it('verify decorator attributes are added to the request', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({status: 200}));
    });
    const testClient = new TestClient(requestMock);

    // Assert
    expect(testClient.getServiceId()).toBe( 'customer-service');
    expect(testClient.getBaseUrl()).toBe( '/api/v1/customers');
    expect(testClient.getDefaultHeaders() as any).toStrictEqual ({
      'content-type': 'application/json'
    });

  });
});
