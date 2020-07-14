/**
 * Configure the GRAPHQL client
 * @param options global clients optionz
 */
export function graphqlClient(options: GraphqlClientArgs) {
  return (Target) => {
    if (options.baseUrl) {
      Target.prototype.getBaseUrl = () => {
        return options.baseUrl;
      };
    }
    if (options.headers) {
      Target.prototype.getDefaultHeaders = () => options.headers;
    }
    return Target;
  };
}

interface GraphqlClientArgs {
  baseUrl?: string;
  headers?: { [header: string]: string | string[] };
}
