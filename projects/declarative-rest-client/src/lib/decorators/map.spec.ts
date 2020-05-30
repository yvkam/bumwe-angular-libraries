import { assert } from 'chai';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { GET } from './request-methods';
import { Map } from './map';

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

class Item {

  public name: string;
  public desc: string;

  constructor( props: { name: string, desc: string } ) {
    this.name = props.name;
    this.desc = props.desc;
  }
}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @GET( '/test' )
  @Map( resp => new Item(JSON.parse(resp)))
  // @ts-ignore
  public getItems(): Observable<Item> {
    return;
  }

}

describe( '@Map', () => {

  it( 'verify Map function is called', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      const json: any = { name: 'itemName', desc: 'Some awesome item' };
      return of( new HttpResponse<any>( { body: JSON.stringify( json ) } ) );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe( item => {
      try {
        assert.equal( item.name, 'itemName' );
        assert.equal( item.desc, 'Some awesome item' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );
} );
