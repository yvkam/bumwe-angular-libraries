import {tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {RestClient} from '../rest-client';
import {Get, Post} from './request-methods';

import {Body, FORMAT, Header, pathParam, PlainQuery, QueryParam} from './parameters';

describe('@variable', () => {

  it('resolve variable variable', (done: (e?: any) => void) => {
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

  it('resolve missing variable variable', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock);

    try {
      // Act
      testClient.getItem();
// Assert
    } catch (e) {
      expect(e.message).toBe( 'Missing path variable \'id\' in path /items/{id}');
    }

  });

  it('resolve default variable variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock, resp => {
      // Assert
      try {
        expect(resp.url).toBe( '/items2/7');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItem2().subscribe();
  });

  it('resolve multiple variable variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.url}));
    });
    const testClient = new TestClientPath(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items3/20/status/status-done.json');
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
        expect(resp.url).toBe( '/items?page=5');
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
        expect(resp.url).toBe( '/items');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems().subscribe();
  });

  it('resolve default QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items2?page=20');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems2().subscribe();
  });

  it('resolve multiple QueryParam variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items3?sort=asc&size=20&page=3');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems3(3, '20').subscribe();

  });

  it('resolve Collection FORMAT CSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/itemsCSV?field=name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsCSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection FORMAT SSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/itemsSSV?field=name%20desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsSSV(['name', 'desc']).subscribe();
  });

  it('resolve Collection FORMAT TSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/itemsTSV?field=name%09desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsTSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection FORMAT PIPES', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/itemsPIPES?field=name%7Cdesc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsPIPES(['name', 'desc']).subscribe();

  });

  it('resolve Collection FORMAT MULTI', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/itemsMULTI?field=name&field=desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsMULTI(['name', 'desc']).subscribe();
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
        expect(resp.url).toBe( '/items?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems('page=5&filter=name').subscribe();

  });

  it('resolve PlainQuery as a string', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientPlainQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems('?page=5&filter=name').subscribe();

  });

  it('resolve PlainQuery as object', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({url: req.urlWithParams}));
    });
    const testClient = new TestClientPlainQuery(requestMock, resp => {
      try {
        expect(resp.url).toBe( '/items2?page=5&filter=name');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems2({page: 5, filter: 'name'}).subscribe();

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
        expect(resp.headers.getAll('page')).toStrictEqual( ['5']);
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
        expect(resp.headers.has('path')).toBeFalsy();
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems().subscribe();
  });

  it('resolve default Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.getAll('page')).toStrictEqual(  ['20']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems2().subscribe();

  });

  it('resolve multiple Header variable', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.getAll('page')).toStrictEqual( ['3']);
        expect(resp.headers.getAll('sort')).toStrictEqual( ['asc']);
        expect(resp.headers.getAll('size')).toStrictEqual(  ['20']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItems3(3, '20').subscribe();

  });

  it('resolve Collection', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.get('field')).toBe( 'name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsDefault(['name', 'desc']).subscribe();
  });

  it('resolve Collection FORMAT CSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.get('field')).toBe('name,desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsCSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection FORMAT SSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.get('field')).toBe( 'name desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsSSV(['name', 'desc']).subscribe();

  });

  it('resolve Collection FORMAT TSV', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.get('field')).toBe( 'name\tdesc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsTSV(['name', 'desc']).subscribe();
  });

  it('resolve Collection FORMAT PIPES', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.get('field')).toBe( 'name|desc');
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsPIPES(['name', 'desc']).subscribe();
  });

  it('resolve Collection FORMAT MULTI', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({headers: req.headers}));
    });
    const testClient = new TestClientHeader(requestMock, resp => {
      try {
        expect(resp.headers.getAll('field')).toStrictEqual(  ['name', 'desc']);
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.getItemsMULTI(['name', 'desc']).subscribe();

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
        expect(JSON.parse(resp.body)).toStrictEqual( {name: 'Awesome Item'});
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
        expect(resp.body).toBeNull();
        done();
      } catch (e) {
        done(e);
      }
    });

    // Act
    testClient.createItem().subscribe();
  });

  it('resolve 2 Body variable', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({body: req.body}));
    });
    const testClient = new TestClientBody(requestMock);

    // Act
    try {
      expect( testClient.createItem2({name: 'first'}, {name: 'second'})).toThrow();
    } catch (e) {
      expect(e.message).toBe( 'Only one @Body is allowed');
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

  responseInterceptor(resp: HttpResponse<any>): Observable<HttpResponse<any>> {
    if (this.responseCallback) {
      return of(resp).pipe(tap(this.responseCallback));
    }
    return of(resp);
  }

  @Get('/items/{id}')
  public getItem(@pathParam('id') id?: number): Observable<HttpResponse<any>> {
    return;
  }

  @Get('/items2/{id}')
  public getItem2(@pathParam('id', {value: 7}) id?: number): Observable<HttpResponse<any>> {
    return;
  }

  @Get('/items3/{id}/status/status-{statusName}.{ext}')
  public getItem3(@pathParam('id') id: number,
                  @pathParam('statusName') statusName: string,
                  @pathParam('ext', {value: 'json'}) ext?: string): Observable<HttpResponse<any>> {
    return;
  }

}

class TestClientQuery extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: HttpResponse<any>): Observable<HttpResponse<any>> {
    if (this.responseCallback) {
      return of(resp).pipe(tap(this.responseCallback));
    }
    return of(resp);
  }

  @Get('/items')
  public getItems(@QueryParam('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/items2')
  public getItems2(@QueryParam('page', {value: 20}) page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/items3')
  public getItems3(@QueryParam('page') page: number,
                   @QueryParam('size', {value: 20}) size?: string,
                   @QueryParam('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsCSV')
  public getItemsCSV(@QueryParam('field', {format: FORMAT.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsSSV')
  public getItemsSSV(@QueryParam('field', {format: FORMAT.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsTSV')
  public getItemsTSV(@QueryParam('field', {format: FORMAT.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsPIPES')
  public getItemsPIPES(@QueryParam('field', {format: FORMAT.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsMULTI')
  public getItemsMULTI(@QueryParam('field', {format: FORMAT.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
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

  responseInterceptor(resp: HttpResponse<any>): Observable<HttpResponse<any>> {
    if (this.responseCallback) {
      return of(resp).pipe(tap(this.responseCallback));
    }
    return of(resp);
  }

  @Get('/items')
  public getItems(@PlainQuery query?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/items2')
  public getItems2(@PlainQuery query?: AnyQuery): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientHeader extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: HttpResponse<any>): Observable<HttpResponse<any>> {
    if (this.responseCallback) {
      return of(resp).pipe(tap(this.responseCallback));
    }
    return of(resp);
  }

  @Get('/items')
  public getItems(@Header('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/items2')
  public getItems2(@Header('page', {value: '20'}) page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/items3')
  public getItems3(@Header('page') page: number,
                   @Header('size', {value: 20}) size?: string,
                   @Header('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsDefault')
  public getItemsDefault(@Header('field') fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsCSV')
  public getItemsCSV(@Header('field', {format: FORMAT.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsSSV')
  public getItemsSSV(@Header('field', {format: FORMAT.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsTSV')
  public getItemsTSV(@Header('field', {format: FORMAT.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsPIPES')
  public getItemsPIPES(@Header('field', {format: FORMAT.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @Get('/itemsMULTI')
  public getItemsMULTI(@Header('field', {format: FORMAT.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientBody extends RestClient {

  constructor(httpHandler: HttpClient, private responseCallback?: (resp: any) => void) {
    super(httpHandler);
  }

  responseInterceptor(resp: HttpResponse<any>): Observable<HttpResponse<any>> {
    if (this.responseCallback) {
      return of(resp).pipe(tap(this.responseCallback));
    }
    return of(resp);
  }

  @Post('/items')
  public createItem(@Body bdy?: any): Observable<HttpResponse<any>> {
    return;
  }

  @Get('/items2')
  public createItem2(@Body body1?: any, @Body body2?: any): Observable<HttpResponse<any>> {
    return;
  }

}
