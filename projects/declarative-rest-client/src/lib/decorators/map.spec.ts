import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { AbstractRestClient } from '../abstract-rest-client';
import {Get, Post} from './request-methods';
import { Map } from './map';

describe( '@Map', () => {

  it( 'verify Map function is called', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( () => {
      const json: any = { name: 'itemName', desc: 'Some awesome item' };
      return of( new HttpResponse<any>( { body: JSON.stringify( json ) } ) );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe( item => {
      try {
        expect(item).toBeInstanceOf(Item);
        expect(item.name).toBe( 'itemName' );
        expect(item.desc).toBe( 'Some awesome item' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'verify Map function is applied and full HttpResponse returned', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( () => {
      const json: any = { name: 'itemName', desc: 'Some awesome item' };
      return of(new HttpResponse<any>({ status: 201, body: JSON.stringify(json) }));
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    const result = testClient.postItemsHttpResponse();

    // Assert
    result.subscribe( (res: HttpResponse<any>) => {
      expect(res).toBeInstanceOf(HttpResponse);
      expect(res.body).toBeInstanceOf(Item);
      expect(res.body.name).toBe('itemName');
      expect(res.body.desc).toBe('Some awesome item');
      done();
    } );
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

class Item {

  public name: string;
  public desc: string;

  constructor( props: { name: string, desc: string } ) {
    this.name = props.name;
    this.desc = props.desc;
  }
}

class TestClient extends AbstractRestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  @Map(resp => new Item(JSON.parse(resp)))
  public getItems(): Observable<Item> {
    return;
  }

  @Post( {
    path: '/test',
    fullResponse: true
  } )
  @Map(resp => new Item(JSON.parse(resp)))
  public postItemsHttpResponse(): Observable<any> {
    return;
  }

}
