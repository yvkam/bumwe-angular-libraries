import { Injectable } from '@angular/core';
import { AbstractRestClient } from '../../../../declarative-rest-client/src/lib/abstract-rest-client';
import { HttpClient } from '@angular/common/http';
import {
  Delete,
  Get,
  Post,
  Put,
} from '../../../../declarative-rest-client/src/lib/decorators/request-methods';
import { RestClient } from '../../../../declarative-rest-client/src/lib/decorators/rest-client';
import { Observable } from 'rxjs';
import {
  Body,
  PathParam,
} from '../../../../declarative-rest-client/src/lib/decorators/parameters';

@Injectable({
  providedIn: 'root',
})
@RestClient({
  baseUrl: 'api/authors',
})
export class AuthorService extends AbstractRestClient {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  @Get('')
  find(): Observable<Author[]> {
    return;
  }

  @Post('')
  add(@Body author: Author): Observable<Author> {
    return;
  }

  @Get('/{id}')
  get(@PathParam('id') id?: string): Observable<Author> {
    return;
  }

  @Put('/{id}')
  update(
    @PathParam('id') id: string,
    @Body author: Author
  ): Observable<Author> {
    return;
  }

  @Delete('/{id}')
  delete(@PathParam('id') id: string): Observable<Author> {
    return;
  }
}

export interface Author {
  id: string;
  name: string;
}
