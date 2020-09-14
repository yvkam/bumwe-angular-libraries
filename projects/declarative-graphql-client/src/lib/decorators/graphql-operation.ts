import {GraphqlClient} from '../graphql-client';
import {graphqlOperationProcessor} from '../processors/graphql-operation-processor';

export enum GraphqlOperation {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

/**
 * Get method
 * @param () => url - resource url of the method
 */
export const Request: (args: GenericGraphqlOperationArgs) =>
  (target: GraphqlClient, propertyKey: string, descriptor: any) => any = graphqlOperationProcessor();

/**
 * Get method
 * @param () => url - resource url of the method
 */
export const Query: (args: GraphqlOperationArgs ) => (target: GraphqlClient, propertyKey: string, descriptor: any) => any =
  graphqlOperationProcessor(GraphqlOperation.QUERY);

/**
 * Post method
 * @param () => url - resource url of the method
 */
export const Mutation: (args: GraphqlOperationArgs) => (target: GraphqlClient, propertyKey: string, descriptor: any) => any =
  graphqlOperationProcessor(GraphqlOperation.MUTATION);

/**
 * Put method
 * @param () => url - resource url of the method
 */
export const Subscription: (args: GraphqlOperationArgs) => (target: GraphqlClient, propertyKey: string, descriptor: any) => any =
  graphqlOperationProcessor(GraphqlOperation.SUBSCRIPTION);


export interface GraphqlOperationArgs {
  query?: string;
  timeout?: number;
  requestAuthHeaders?: string[];
  responseAuthHeaders?: string[];
}

export interface GenericGraphqlOperationArgs extends GraphqlOperationArgs{
  method: GraphqlOperation;
}
