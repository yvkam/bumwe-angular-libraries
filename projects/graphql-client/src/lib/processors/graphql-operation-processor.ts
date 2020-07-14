import {GraphqlOperation, GraphqlOperationArgs} from '../decorators/graphql-operation';
import {GraphqlClient} from '../graphql-client';

export function graphqlOperationProcessor(method?: GraphqlOperation) {
  return (annotationArgs: GraphqlOperationArgs) => {
    return (target: GraphqlClient, propertyKey: string, descriptor: any) => {

      descriptor.value = (...targetMethodArgs: any[]) => {

        return null;
      };

      return descriptor;
    };
  };
}
