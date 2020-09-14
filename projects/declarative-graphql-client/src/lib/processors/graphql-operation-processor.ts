import {GraphqlOperation, GraphqlOperationArgs} from '../decorators/graphql-operation';
import {Apollo} from 'apollo-angular';
import {GraphqlClient} from '../graphql-client';

export function graphqlOperationProcessor(method?: GraphqlOperation) {
  return (annotationArgs: GraphqlOperationArgs) => {
    return (target: GraphqlClient, propertyKey: string, descriptor: any) => {

      descriptor.value = (...targetMethodArgs: any[]) => {
        const query = {};
        const variables = {};

        return (this.apollo as Apollo).query({
          query,
          variables
        });
      };

      return descriptor;
    };
  };
}
