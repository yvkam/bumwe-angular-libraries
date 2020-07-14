import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Apollo} from 'apollo-angular';

/**
 * RestClient class.
 *
 */
export abstract class GraphqlClient {
  protected constructor(protected apollo: Apollo) {}
}
