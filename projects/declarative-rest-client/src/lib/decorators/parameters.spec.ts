import {tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {RestClient} from '../rest-client';
import {get, post} from './request-methods';

import {body, FORMAT, header, pathParam, plainQuery, queryParam} from './parameters';

describe('@pathParam', () => {

  it('resolve pathParam variable', (done: (e?: any) => void) => {
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

  it('resolve missing pathParam variable', () => {
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

  it('resolve default pathParam variable', (done: (e?: any) => void) => {
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

  it('resolve multiple pathParam variable', (done: (e?: any) => void) => {
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

describe('@queryParam', () => {

  it('resolve queryParam variable', (done: (e?: any) => void) => {
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

  it('resolve missing queryParam variable', (done: (e?: any) => void) => {
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

  it('resolve default queryParam variable', (done: (e?: any) => void) => {
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

  it('resolve multiple queryParam variable', (done: (e?: any) => void) => {
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

describe('@plainQuery', () => {

  it('resolve plainQuery as a string', (done: (e?: any) => void) => {
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

  it('resolve plainQuery as a string', (done: (e?: any) => void) => {
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

  it('resolve plainQuery as object', (done: (e?: any) => void) => {
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

describe('@header', () => {

  it('resolve header variable', (done: (e?: any) => void) => {
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

  it('resolve missing header variable', (done: (e?: any) => void) => {
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

  it('resolve default header variable', (done: (e?: any) => void) => {
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

  it('resolve multiple header variable', (done: (e?: any) => void) => {
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

describe('@body', () => {

  it('resolve body variable', (done: (e?: any) => void) => {
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

  it('resolve missing body variable', (done: (e?: any) => void) => {
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

  it('resolve 2 body variable', () => {
    // Arrange
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({body: req.body}));
    });
    const testClient = new TestClientBody(requestMock);

    // Act
    try {
      expect( testClient.createItem2({name: 'first'}, {name: 'second'})).toThrow();
    } catch (e) {
      expect(e.message).toBe( 'Only one @body is allowed');
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

  @get('/items/{id}')
  public getItem(@pathParam('id') id?: number): Observable<HttpResponse<any>> {
    return;
  }

  @get('/items2/{id}')
  public getItem2(@pathParam('id', {value: 7}) id?: number): Observable<HttpResponse<any>> {
    return;
  }

  @get('/items3/{id}/status/status-{statusName}.{ext}')
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

  responseInterceptor(resp: Observable<HttpResponse<any>>) {
    if (this.responseCallback) {
      return resp.pipe(tap(this.responseCallback));
    }
    return resp;
  }

  @get('/items')
  // @ts-ignore
  public getItems(@queryParam('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/items2')
  // @ts-ignore
  public getItems2(@queryParam('page', {value: 20}) page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/items3')
  // @ts-ignore
  public getItems3(@queryParam('page') page: number,
                   @queryParam('size', {value: 20}) size?: string,
                   @queryParam('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsCSV')
  // @ts-ignore
  public getItemsCSV(@queryParam('field', {format: FORMAT.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsSSV')
  // @ts-ignore
  public getItemsSSV(@queryParam('field', {format: FORMAT.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsTSV')
  // @ts-ignore
  public getItemsTSV(@queryParam('field', {format: FORMAT.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsPIPES')
  // @ts-ignore
  public getItemsPIPES(@queryParam('field', {format: FORMAT.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsMULTI')
  // @ts-ignore
  public getItemsMULTI(@queryParam('field', {format: FORMAT.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
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

  @get('/items')
  // @ts-ignore
  public getItems(@plainQuery query?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/items2')
  // @ts-ignore
  public getItems2(@plainQuery query?: AnyQuery): Observable<HttpResponse<any>> {
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

  @get('/items')
  // @ts-ignore
  public getItems(@header('page') page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/items2')
  // @ts-ignore
  public getItems2(@header('page', {value: '20'}) page?: number): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/items3')
  // @ts-ignore
  public getItems3(@header('page') page: number,
                   @header('size', {value: 20}) size?: string,
                   @header('sort', {value: 'asc'}) sort?: string): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsDefault')
  // @ts-ignore
  public getItemsDefault(@header('field') fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsCSV')
  // @ts-ignore
  public getItemsCSV(@header('field', {format: FORMAT.CSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsSSV')
  // @ts-ignore
  public getItemsSSV(@header('field', {format: FORMAT.SSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsTSV')
  // @ts-ignore
  public getItemsTSV(@header('field', {format: FORMAT.TSV}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsPIPES')
  // @ts-ignore
  public getItemsPIPES(@header('field', {format: FORMAT.PIPES}) fields: string | string[]): Observable<HttpResponse<any>> {
    return null;
  }

  @get('/itemsMULTI')
  // @ts-ignore
  public getItemsMULTI(@header('field', {format: FORMAT.MULTI}) fields: string | string[]): Observable<HttpResponse<any>> {
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

  @post('/items')
  // @ts-ignore
  public createItem(@body bdy?: any): Observable<HttpResponse<any>> {
    return;
  }

  @get('/items2')
  // @ts-ignore
  public createItem2(@body body1?: any, @body body2?: any): Observable<HttpResponse<any>> {
    return;
  }

}
