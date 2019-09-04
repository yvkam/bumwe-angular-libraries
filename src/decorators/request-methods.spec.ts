import { assert } from 'chai';
import { Observable, of } from 'rxjs';
import { RestClient } from '../rest-client';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Get, Post, RequestMethod } from './request-methods';

class HttpMock extends HttpClient {

  public callCount: number = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request(req: HttpRequest<any>|any, p2?:any, p3?:any, p4?:any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  // @ts-ignore
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  @Post( '/test' )
  // @ts-ignore
  public createItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

describe( '@Get', () => {

  it( 'verify request method is set', () => {
    // Arrange
    var method;
    var url;
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    let testClient  = new TestClient( requestMock );

    // Act
    let result = testClient.getItems().subscribe();

    assert.equal( method, RequestMethod.GET );
    assert.equal( url, '/test' );
  } );
} );

describe( '@Post', () => {

  it( 'verify request method is set', () => {
    // Arrange
    var method;
    var url;
    let requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      method = req.method;
      url    = req.url;
      return of( new HttpResponse<any>() );
    } );
    let testClient  = new TestClient( requestMock );

    // Act
    let result = testClient.createItems().subscribe();

    assert.equal( method, RequestMethod.POST );
    assert.equal( url, '/test' );
  } );
} );
