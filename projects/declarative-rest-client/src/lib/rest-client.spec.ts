import { assert } from 'chai';
import { Observable, of } from 'rxjs';
import { timeout, tap } from 'rxjs/operators';
import { RestClient } from './rest-client';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { GET, RequestMethod } from './decorators/request-methods';

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

class TestClient1 extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET( '/test' )
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClient2 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorRequest: HttpRequest<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET( '/test' )
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  protected requestInterceptor( req: HttpRequest<any> ): HttpRequest<any> {
    this.interceptorCallCount++;
    this.interceptorRequest = req;
    return req;
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorRequest: HttpRequest<any>;
  public timeout = false;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET( '/test' )
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  protected requestInterceptor( req: HttpRequest<any> ): Observable<HttpRequest<any>> {
    this.interceptorCallCount++;
    this.interceptorRequest = req;

    return of(req).pipe(
      timeout(1000),
      tap(() => this.timeout = true)
    );
  }

}

class TestClient4 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorResponse: Observable<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET( '/test' )
  // @ts-ignore
  public getItems(): Observable<Response> {
    return null;
  }

  protected responseInterceptor( res: Observable<HttpResponse<any>> ): Observable<any> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return res;
  }

}

describe( 'RestClient', () => {
  beforeEach( () => {
    // Nothing here yet.
  } );

  it( 'checkSetup', () => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse() );
    } );
    const testClient  = new TestClient1( requestMock );

    // Act
    testClient.getItems().subscribe();
// Assert
    assert.equal( requestMock.callCount, 1 );
    assert.equal( requestMock.lastRequest.method, RequestMethod.GET );

  } );

  it( 'call requestInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( ) );
    } );
    const testClient  = new TestClient2( requestMock );

    // Act
    testClient.getItems();
// Assert
    assert.equal( testClient.interceptorCallCount, 1 );
    assert.equal( testClient.interceptorRequest.method, RequestMethod.GET );

  } );

  it( 'call requestInterceptor asynchronous', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( ) );
    } );
    const testClient  = new TestClient3( requestMock );

    // Act
    testClient.getItems().subscribe(() => {
      assert.equal( testClient.timeout, true );
      done();
    });
// Assert
    assert.equal( testClient.timeout, true );
    assert.equal( testClient.interceptorCallCount, 1 );
    assert.equal( testClient.interceptorRequest.method, RequestMethod.GET );

  } );

  it( 'call responseInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { status: 200 } ) );
    } );
    const testClient  = new TestClient4( requestMock );

    // Act
    testClient.getItems();
// Assert
    assert.equal( testClient.interceptorCallCount, 1 );

  } );
} );
