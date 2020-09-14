import {Apollo} from 'apollo-angular';

/**
 * Graphql class.
 *
 */
export abstract class GraphqlClient {
  protected constructor(protected apollo: Apollo) {}
}
