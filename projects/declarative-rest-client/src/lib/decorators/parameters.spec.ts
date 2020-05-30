import {assert} from 'chai';
import {tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {RestClient} from '../rest-client';
import {GET, POST} from './request-methods';

import {Body, Format, Header, PathParam, PlainQuery, QueryParam} from './parameters';

describe('@PathParam', () => {

  it('resolve PathParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });

    // assert
    const testClient = new TestClientPath(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items/5');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItem(5).subscribe();
  });

  it('resolve missing PathParam variable', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock);

    try {
      // Act
      testClient.getItem();
// Assert
      assert.fail();
    } catch (e) {
      expect(e.message).toBe( 'Missing path variable \'id\' in path /items/{id}');
    }

  });

  it('resolve default PathParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock, resp => {
      // Assert
      try {
        assert.equal(resp.url, '/items2/7');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItem2().subscribe();
  });

  it('resolve multiple PathParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items3/20/status/status-done.json');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItem3(20, 'done').subscribe();
  });
});

describe('@QueryParam', () => {

  it('resolve QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items?page=5');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems(5).subscribe();
  });

  it('resolve missing QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      // Assert
      try {
        assert.equal(resp.url, '/items');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems().subscribe();
  });

  it('resolve default QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items2?page=20');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems2().subscribe();
  });

  it('resolve multiple QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items3?sort=asc&size=20&page=3');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems3(3, '20').subscribe();

  });

  it('resolve Collection Format CSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/itemsCSV?field=name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsCSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection Format SSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/itemsSSV?field=name%20desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsSSV(['name', 'desc']).subscribe();
  });

  it('resolve Collection Format TSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/itemsTSV?field=name%09desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsTSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection Format PIPES', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/itemsPIPES?field=name%7Cdesc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsPIPES(['name', 'desc']).subscribe();

  });

  it('resolve Collection Format MULTI', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/itemsMULTI?field=name&field=desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsMULTI(['name', 'desc']).subscribe();
  });
});

describe('@PlainQuery', () => {

  it('resolve PlainQuery as a string', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientPlainQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems('page=5&filter=name').subscribe();

  });

  it('resolve PlainQuery as a string', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientPlainQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems('?page=5&filter=name').subscribe();

  });

  it('resolve PlainQuery as object', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientPlainQuery(requestMock, resp => {
      try {
        assert.equal(resp.url, '/items2?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems2({page: 5, filter: 'name'}).subscribe();

  });
});

describe('@Header', () => {

  it('resolve Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page') as any, ['5']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems(5).subscribe();
  });

  it('resolve missing Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.isFalse(resp.headers.has('path'));
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems().subscribe();
  });

  it('resolve default Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page'), ['20']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems2().subscribe();

  });

  it('resolve multiple Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.deepEqual(resp.headers.getAll('page') as any, ['3']);
        assert.deepEqual(resp.headers.getAll('sort'), ['asc']);
        assert.deepEqual(resp.headers.getAll('size'), ['20']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItems3(3, '20').subscribe();

  });

  it('resolve Collection', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsDefault(['name', 'desc']).subscribe();
  });

  it('resolve Collection Format CSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsCSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection Format SSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsSSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection Format TSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name\tdesc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsTSV(['name', 'desc']).subscribe();
  });

  it('resolve Collection Format PIPES', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.equal(resp.headers.get('field'), 'name|desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsPIPES(['name', 'desc']).subscribe();
  });

  it('resolve Collection Format MULTI', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        assert.deepEqual(resp.headers.getAll('field'), ['name', 'desc']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.getItemsMULTI(['name', 'desc']).subscribe();

  });
});

describe('@Body', () => {

  it('resolve Body variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({body: req.body}));
    });
    const testClient = new TestClientBody(requestMock, resp => {
      try {
        assert.deepEqual(JSON.parse(resp.body), {name: 'Awesome Item'});
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.createItem({name: 'Awesome Item'}).subscribe();
  });

  it('resolve missing Body variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({body: req.body}));
    });
    const testClient = new TestClientBody(requestMock, resp => {
      try {
        assert.deepEqual(resp.body, null);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    const result = testClient.createItem().subscribe();
  });

  it('resolve 2 Body variable', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({body: req.body}));
    });
    const testClient = new TestClientBody(requestMock);

    // Act
    try {
      testClient.createItem2({name: 'first'}, {name: 'second'});
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'Only one @Body is allowed');
    }
  });
});

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor(private requestFunction: (req: HttpRequest<any>) => Observable<HttpResponse<any>>) {
    super(null);
  }

  request<R>(req: HttpRequest<any> | any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClientPath extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @GET('/items/{id}')
  // @ts-ignoredd
  public getItem(@PathParam('id') id?: number): Observable<HttpResponse<any>> {
    return;
  }

  @GET('/items2/{id}')
  // @ts-ignore
  public getItem2(@PathParam('id', {value: 7}) id?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items3/{id}/status/status-{statusName}.{ext}')
  // @ts-ignore
  public getItem3(@PathParam('id') id: number,
                  @PathParam('statusName') statusName: string,
                  @PathParam('ext', {value: 'json'}) ext?: string): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientQuery extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @GET('/items')
  // @ts-ignore
  public getItems(@QueryParam('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items2')
  // @ts-ignore
  public getItems2(@QueryParam('page', '20') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items3')
  // @ts-ignore
  public getItems3(@QueryParam('page') page: number,
                   @QueryParam('size', {value: 20}) size?: string,
                   @QueryParam('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsCSV')
  // @ts-ignore
  public getItemsCSV(@QueryParam('field', {format: Format.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsSSV')
  // @ts-ignore
  public getItemsSSV(@QueryParam('field', {format: Format.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsTSV')
  // @ts-ignore
  public getItemsTSV(@QueryParam('field', {format: Format.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsPIPES')
  // @ts-ignore
  public getItemsPIPES(@QueryParam('field', {format: Format.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsMULTI')
  // @ts-ignore
  public getItemsMULTI(@QueryParam('field', {format: Format.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

}

interface AnyQuery {
  [k: string]: any;
}

class TestClientPlainQuery extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @GET('/items')
  // @ts-ignore
  public getItems(@PlainQuery query?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items2')
  // @ts-ignore
  public getItems2(@PlainQuery query?: AnyQuery): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientHeader extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @GET('/items')
  // @ts-ignore
  public getItems(@Header('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items2')
  // @ts-ignore
  public getItems2(@Header('page', '20') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items3')
  // @ts-ignore
  public getItems3(@Header('page') page: number,
                   @Header('size', {value: 20}) size?: string,
                   @Header('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsDefault')
  // @ts-ignore
  public getItemsDefault(@Header('field') fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsCSV')
  // @ts-ignore
  public getItemsCSV(@Header('field', {format: Format.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsSSV')
  // @ts-ignore
  public getItemsSSV(@Header('field', {format: Format.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsTSV')
  // @ts-ignore
  public getItemsTSV(@Header('field', {format: Format.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsPIPES')
  // @ts-ignore
  public getItemsPIPES(@Header('field', {format: Format.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/itemsMULTI')
  // @ts-ignore
  public getItemsMULTI(@Header('field', {format: Format.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientBody extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @POST('/items')
  // @ts-ignore
  public createItem(@Body body?: any): Observable<HttpResponse<any>> {
    return null;
  }

  @GET('/items2')
  // @ts-ignore
  public createItem2(@Body body1?: any, @Body body2?: any): Observable<HttpResponse<any>> {
    return null;
  }

}
