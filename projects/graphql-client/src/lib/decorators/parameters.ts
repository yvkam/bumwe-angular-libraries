import {GraphqlClient} from '../graphql-client';

export const metadataKeySuffix = {
  variable: `_PathParam_parameters`,
  operation: `_Body_parameters`,
  header: `_Header_parameters`,
};

/**
 * variable variable of a method's url, type: string
 * @param key - path key to bind value
 */
export const variable = paramBuilder(metadataKeySuffix.variable);


/**
 * Body of a REST method, type: key-value pair object
 * Only one Body per method!
 */
export const Query = paramBuilder(metadataKeySuffix.operation)(metadataKeySuffix.operation);
export const Mutation = Query;
export const Subscription = Query;

/**
 * Custom Header of a REST method, type: string
 * @param key - Header key to bind value
 */
export const Header = paramBuilder(metadataKeySuffix.header);


export function paramBuilder(paramName: string) {
  return (name?: string, args?: { value?: any, format?: string }) => {
    return (target: GraphqlClient, propertyKey: string | symbol, index: number) => {
      const value = args ? args.value : undefined;
      const metadataKey = `${propertyKey as string}${paramName}`;
      const metadata = { key: name, value, index};
      target[metadataKey] = (target[metadataKey] || []) as Array<any>;
      target[metadataKey].push(metadata);
    };
  };
}

export interface ParameterMetadata {
  key: string;
  value: string;
  index: string;
  format: string;
}
