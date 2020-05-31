import {Observable, of} from 'rxjs';
import {RestClient} from '../rest-client';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {get, post, request, RequestMethod} from './request-methods';

describe('@get', () => {

  it('verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      method = req.method;
      url = req.url;
      return of(new HttpResponse<any>());
    });
    const testClient = new TestClient(requestMock);

    // Act
    testClient.getItems().subscribe();
    expect(method).toBe(RequestMethod.GET);
    expect(url).toBe('/test');
  });
});

describe('@post', () => {

  it('verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      method = req.method;
      url = req.url;
      return of(new HttpResponse<any>());
    });
    const testClient = new TestClient(requestMock);

    // Act
    testClient.createItems().subscribe();
    expect(method).toBe(RequestMethod.POST);
    expect(url).toBe('/test');
  });
});

describe('@request', () => {

  it('verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      method = req.method;
      url = req.url;
      return of(new HttpResponse<any>());
    });
    const testClient = new TestClient(requestMock);

    // Act
    testClient.getItems1().subscribe();
    expect(method).toBe(RequestMethod.POST);
    expect(url).toBe('/test');
  });

  it('verify produces and consumes are set', () => {
    // Arrange
    let headers: HttpHeaders;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      headers = req.headers;
      return of(new HttpResponse<any>());
    });
    const testClient = new TestClient(requestMock);

    // Act
    testClient.getItems1().subscribe();
    expect(headers.get('accept')).toBe('text/html');
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('verify tokens are set', () => {
    // Arrange
    let headers: HttpHeaders;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      headers = req.headers;
      return of(new HttpResponse<any>({body: 'body', headers: new HttpHeaders({'jwt2': '2'})}));
    });
    const testClient = new TestClient(requestMock);
    Object.defineProperty(window, 'sessionStorage', {
      value: (() => {
        const store = {};
        return {
          getItem(key) {
            return store[key] || null;
          },
          setItem(key, value) {
            store[key] = value.toString();
          }
        };
      })()

    });

    sessionStorage.setItem('jwt1', '1');

    // Act
    testClient.getItems1().subscribe();

    // assertions
    expect(headers.get('jwt1')).toBe('1');
    // expect(sessionStorage.getItem('jwt2')).toBe('2');
  });
});

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor(private requestFunction: (req: HttpRequest<any>) => Observable<HttpResponse<any>>) {
    super(null);
  }

  request(req: HttpRequest<any> | any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient extends RestClient {

  constructor(httpHandler: HttpClient) {
    super(httpHandler);
  }

  @get('/test')
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  @request(
    {path: '/test', method: RequestMethod.POST},
    {consumes: ['text/html'], produces: ['application/json'], tokensToSend: ['jwt1'], tokensToIntercept: ['jwt2']})
  // @ts-ignore
  public getItems1(): Observable<HttpResponse<any>> {
    return;
  }

  @post('/test')
  // @ts-ignore
  public createItems(): Observable<HttpResponse<any>> {
    return;
  }

}
