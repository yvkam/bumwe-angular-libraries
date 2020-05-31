import { map} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { onEmit } from './on-emit';
import { get } from './request-methods';

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

  constructor(props: { name: string, desc: string }) {
    this.name = props.name;
    this.desc = `*${props.desc}`;
  }
}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @get('/test')
  @onEmit(obs => obs.pipe(map(resp => new Item(JSON.parse(resp)))))
  // @ts-ignore
  public getItems(): Observable<Item> {
    return;
  }

}

describe('@onEmit', () => {

  it('verify onEmit function is called', (done: (e?: any) => void) => {
    // Arrange
    const requestMock = new HttpMock(() => {
      const json: any = { name: 'itemName', desc: 'Some awesome item' };
      return of(new HttpResponse<any>({body: JSON.stringify(json)}));
    });
    const testClient = new TestClient(requestMock);

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe(item => {
      try {
        expect( item.name).toBe( 'itemName' );
        expect( item.desc).toBe( '*Some awesome item' );
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
