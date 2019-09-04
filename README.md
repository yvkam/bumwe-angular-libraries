[![npm version](https://badge.fury.io/js/angular-rest-client.svg)](https://badge.fury.io/js/angular-rest-client)
[![Build Status](https://travis-ci.org/rosostolato/angular-rest-client.svg?branch=master)](https://travis-ci.org/rosostolato/angular-rest-client)
[![codecov](https://codecov.io/gh/rosostolato/angular-rest-client/branch/master/graph/badge.svg)](https://codecov.io/gh/rosostolato/angular-rest-client)

# Update (2019-09-04) - v7.3.0
> **WARNING**: Version 7.3.0 is a big update that can break codes.

On this last build, I...
- fixed some bugs;
- fixed all spec files and now all tests are passing;
- `requestInterceptor` can return a observable for async requests
- removed `@Produces` decorator.

The reason that I removed `@Produces` is that now the default response will always be `resp.body`. If you still need to get the entire `HttpResponse`, you should use `ResponseInterceptor` method.

# Update (2019-03-26)
- Inserted `PlainQuery` (Query as object)
- Added `withCredentials` on Client decorator


# angular-rest-client
Angular 7 HTTP client with Typescript Declarative Annotations, Observables, Interceptors and Timeouts.
This package is production ready.

## Installation

```sh
yarn add angular7-rest-client
```
or
```sh
npm install angular7-rest-client --save
```

## Example

```ts

import { Http, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient, RestClient, Client, GET, PUT, POST, DELETE, Headers, Path, Body, Query, PlainQuery, MediaType
} from 'angular-rest-client';

import { Todo } from './models/Todo';
import { SessionFactory } from './sessionFactory';

@Injectable()
@Client({
    serviceId: 'todo-service',
    baseUrl: 'http://localhost:3000/api/',
    headers: {
        'content-type': 'application/json'
    }
})
export class TodoClient extends RestClient {

    constructor(http:Http){
        super(<HttpClient>http);
    }

    protected requestInterceptor(req: Request):void {
        if (SessionFactory.getInstance().isAuthenticated) {
            req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        }
    }

    protected responseInterceptor(res: Observable<Response>): Observable<any> {
        // do anything with responses
        return res;
    }

    @Get("todo/")
    @Timeout(2000) //In milliseconds
    public getTodos( @Query("page") page:number, @Query("size", {default: 20}) size?:number, @Query("sort") sort?: string): Observable<Todo[]> { return null;

    @Get("todo/{id}")
    @Timeout(2000) //In milliseconds
    @Map(resp => new Todo(resp))
    public getTodoById( @Path("id") id: number): Observable<Todo>{ return null; };

    @Post("todo")
    @Timeout(2000) //In milliseconds
    @Headers({
        'content-type': 'application/json'
    })
    public postTodo( @Body todo: Todo): Observable<Todo> { return null; };

    @Put("todo/{id}")
    @Timeout(2000) //In milliseconds
    public putTodoById( @Path("id") id: string, @Body todo: Todo): Observable<Todo> { return null; };

    @Delete("todo/{id}")
    @Timeout(2000) //In milliseconds
    public deleteTodoById( @Path("id") id: string): Observable<Todo> { return null; };
}
```

### Using PlainQuery property

```ts
    export interface PageFilterQuery {
      skip?: number;
      top?: top;
    }

    @Get("todo/{id}")
    @Timeout(2000) //In milliseconds
    @Map(resp => new Todo(resp))
    public getTodoById( @Path("id") id: number, @PlainBody filter?: PageFilterQuery ): Observable<Todo>{ return null; };
```

### Using it in your component

**```app.module.ts```**
``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule
  ],
  providers: [
    TodoClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**```todo.component.ts```**
``` ts
// You need some or all of the following rxjs imports for Promise and Observable.
import 'rxjs/add/observable/defer'; // deprecated
import 'rxjs/add/observable/throw'; // deprecated
import 'rxjs/add/operator/map'; // deprecated
import 'rxjs/add/operator/timeout'; // deprecated
import 'rxjs/add/operator/toPromise'; // deprecated
import { Observable } from 'rxjs/Observable'; // deprecated

@Component({
  selector: 'to-do',
})
export class ToDoCmp {

  constructor(private todoClient: TodoClient) {
  }

  // Use todoClient.
  sampleUsage() {
    this.todoClient.getTodos( /* page */ 1).subscribe(data=>{
      console.log(data)
    })
  }

  // Another example, using Promises.
  sampleUsage2() {
    this.todoClient.getTodos( /* page */ 1).toPromise()
      .then((response: Response) => console.log(response))
      .catch(this.handleError);
    })
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    console.log('ERROR');
    return Promise.reject(error.message || error);
  }
}
```
## API Docs

### RestClient
#### Methods:
- `getServiceId(): string`: returns the serviceId of the RestClient
- `getBaseUrl(): string`: returns the base url of RestClient
- `getDefaultHeaders(): Object`: returns the default headers of RestClient in a key-value pair

### Class decorators:
- `@Client(args:{serviceId?: string, baseUrl?: string, headers?: any, withCredentials?: boolean})`

### Method decorators:
- `@Get(url: String)`
- `@Post(url: String)`
- `@Put(url: String)`
- `@Patch(url: String)`
- `@Delete(url: String)`
- `@Head(url: String)`
- `@Headers(headers: Object)`
- `@Map(mapper:(resp : any) => any)`
- `@OnEmit(emitter:(resp : Observable<any>) => Observable<any>)`
- `@Timeout(timeout: number)`

### Parameter decorators:
- `@Path(name: string, options?: string|{defaultValue?:any})`
- `@Header(name: string, options?: string|{defaultValue?:any, format?:string})`
- `@Query(name: string, options?: string|{defaultValue?:any, format?:string})`
- `@PlainQuery`
- `@PlainBody`
- `@Body`

#### Collection Format
Determines the format of the array if type array is used. (used for ``@Query`` and ``@Header``) Possible values are:
* ``Format.CSV`` - comma separated values ``foo,bar``.
* ``Format.SSV`` - space separated values ``foo bar``.
* ``Format.TSV`` - tab separated values ``foo\tbar``.
* ``Format.PIPES`` - pipe separated values ``foo|bar``.
* ``Format.MULTI`` - corresponds to multiple parameter instances instead of multiple values for a single instance ``foo=bar&foo=baz``. This is valid only for parameters in "query" or "formData".

Default value is ``Format.CSV``.

# Contributors

Brought to you by many contributors, including:

TrustPortal Solutions Ltd  [http://trustportal.org](http://trustportal.org)
Yavin Five
deblockt
Dmitry-Gorbenko
Maxxton Group  [http://www.maxxton.com](http://www.maxxton.com)
Domonkos Pal : Paldom
Discountrobot
TN-Kirontech
LeFinc
mmrath  [http://www.mmrath.com](http://www.mmrath.com)
steven166
Mayur Patel : mayur-novus

# License

MIT
