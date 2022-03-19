import { Observable, of } from 'rxjs';
import { AbstractRestClient } from '../abstract-rest-client';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  Request,
  RequestMethod,
  Trace,
} from './request-methods';

describe('@Get', () => {
  it('verify Request method is set', () => {
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

describe('@Post', () => {
  it('verify Request method is set', () => {
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

describe('@Put', () => {
  it('verify Request method is set', () => {
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
    testClient.putItems().subscribe();
    expect(method).toBe(RequestMethod.PUT);
    expect(url).toBe('/test');
  });
});

describe('@Patch', () => {
  it('verify Request method is set', () => {
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
    testClient.patchItems().subscribe();
    expect(method).toBe(RequestMethod.PATCH);
    expect(url).toBe('/test');
  });
});

describe('@Delete', () => {
  it('verify Request method is set', () => {
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
    testClient.deleteItem().subscribe();
    expect(method).toBe(RequestMethod.DELETE);
    expect(url).toBe('/test');
  });
});

describe('@Trace', () => {
  it('verify Request method is set', () => {
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
    testClient.traceItems().subscribe();
    expect(method).toBe(RequestMethod.TRACE);
    expect(url).toBe('/test');
  });
});

describe('@Head', () => {
  it('verify Request method is set', () => {
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
    testClient.headItems().subscribe();
    expect(method).toBe(RequestMethod.HEAD);
    expect(url).toBe('/test');
  });
});

describe('@Options', () => {
  it('verify Request method is set', () => {
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
    testClient.optionsItems().subscribe();
    expect(method).toBe(RequestMethod.OPTIONS);
    expect(url).toBe('/test');
  });
});

describe('@Request', () => {
  it('verify Request method is set', () => {
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
      return of(
        new HttpResponse<any>({
          body: 'Body',
          headers: new HttpHeaders({ jwt2: '2' }),
        })
      );
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
          },
        };
      })(),
    });

    sessionStorage.setItem('jwt1', '1');

    // Act
    testClient.getItems1().subscribe();

    // assertions
    expect(headers.get('jwt1')).toBe('1');
    expect(sessionStorage.getItem('jwt2')).toBe('2');
  });
});

class HttpMock extends HttpClient {
  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor(
    private requestFunction: (
      req: HttpRequest<any>
    ) => Observable<HttpResponse<any>>
  ) {
    super(null);
  }

  request(
    req: HttpRequest<any> | any,
    p2?: any,
    p3?: any,
    p4?: any
  ): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient extends AbstractRestClient {
  constructor(httpHandler: HttpClient) {
    super(httpHandler);
  }

  @Get('/test')
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  @Request({
    path: '/test',
    method: RequestMethod.POST,
    consumes: ['text/html'],
    produces: ['application/json'],
    requestAuthHeaders: ['jwt1'],
    responseAuthHeaders: ['jwt2'],
  })
  public getItems1(): Observable<HttpResponse<any>> {
    return;
  }

  @Post('/test')
  public createItems(): Observable<HttpResponse<any>> {
    return;
  }

  @Put('/test')
  public putItems(): Observable<HttpResponse<any>> {
    return;
  }

  @Patch('/test')
  public patchItems(): Observable<HttpResponse<any>> {
    return;
  }

  @Delete('/test')
  public deleteItem(): Observable<HttpResponse<any>> {
    return;
  }

  @Head('/test')
  public headItems(): Observable<HttpResponse<any>> {
    return;
  }

  @Options('/test')
  public optionsItems(): Observable<HttpResponse<any>> {
    return;
  }

  @Trace('/test')
  public traceItems(): Observable<HttpResponse<any>> {
    return;
  }
}
