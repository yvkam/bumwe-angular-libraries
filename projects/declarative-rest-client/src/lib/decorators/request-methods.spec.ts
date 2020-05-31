import { Observable, of } from 'rxjs';
import { RestClient } from '../rest-client';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { get, post, RequestMethod } from './request-methods';

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @get( '/test' )
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  @post( '/test' )
  // @ts-ignore
  public createItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

describe( '@get', () => {

  it( 'verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    testClient.getItems().subscribe();
    expect( method.toLowerCase()).toBe(RequestMethod.GET );
    expect( url).toBe( '/test' );
  } );
} );

describe( '@post', () => {

  it( 'verify request method is set', () => {
    // Arrange
    let method;
    let url;
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    testClient.createItems().subscribe();
    expect( method.toLowerCase()).toBe( RequestMethod.POST );
    expect( url).toBe( '/test' );
  } );
} );
