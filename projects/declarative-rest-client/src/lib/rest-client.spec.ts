import { Observable, of } from 'rxjs';
import { timeout, tap } from 'rxjs/operators';
import { RestClient } from './rest-client';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Get, RequestMethod } from './decorators/request-methods';

describe( 'RestClient', () => {
  beforeEach( () => {
    // Nothing here yet.
  } );

  it( 'checkSetup', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse() );
    } );
    const testClient  = new TestClient1( requestMock );

    // Act
    testClient.getItems().subscribe();
// Assert
    expect( requestMock.callCount).toBe( 1 );
    expect( requestMock.lastRequest.method).toBe( RequestMethod.GET );

  } );

  it( 'call requestInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse<any>( ) );
    } );
    const testClient  = new TestClient2( requestMock );

    // Act
    testClient.getItems();
// Assert
    expect( testClient.interceptorCallCount).toBe( 1 );
    expect( testClient.interceptorRequest.method).toBe( RequestMethod.GET );

  } );

  it( 'call requestInterceptor asynchronous', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse<any>( ) );
    } );
    const testClient  = new TestClient3( requestMock );

    // Act
    testClient.getItems().subscribe(() => {
      expect( testClient.timeout).toBe( true );
      done();
    });
// Assert
    expect( testClient.timeout).toBe( true );
    expect( testClient.interceptorCallCount).toBe( 1 );
    expect( testClient.interceptorRequest.method).toBe( RequestMethod.GET );

  } );

  it( 'call responseInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse<any>( { status: 200 } ) );
    } );
    const testClient  = new TestClient4( requestMock );

    // Act
    testClient.getItems().subscribe();
// Assert
    expect( testClient.interceptorCallCount).toBe( 1 );

  } );
} );

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

  @Get( '/test' )
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

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  protected requestInterceptor(req: HttpRequest<any>): Observable<HttpRequest<any>> {
    this.interceptorCallCount++;
    this.interceptorRequest = req;
    return of(req);
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorRequest: HttpRequest<any>;
  public timeout = false;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
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
  public interceptorResponse;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<Response> {
    return null;
  }

  protected responseInterceptor(res: HttpResponse<any>): Observable<HttpResponse<any>> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return of(res);
  }

}
