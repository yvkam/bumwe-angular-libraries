/**
 * Configure the GRAPHQL client
 * @param options global clients optionz
 */
export function graphqlClient(options: GraphqlClientArgs) {
  return (Target) => {
    if (options.headers) {
      Target.prototype.getDefaultHeaders = () => options.headers;
    }
    return Target;
  };
}

interface GraphqlClientArgs {
  headers?: { [header: string]: string | string[] };
}
