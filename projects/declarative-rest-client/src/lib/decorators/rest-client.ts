/**
 * Configure the REST restClient
 * @param options restClient option
 */
export function restClient(options: RestClientArgs) {
  return (Target) => {
    if (options.serviceId) {
      Target.prototype.getServiceId = () => {
        return options.serviceId;
      };
    }
    if (options.baseUrl) {
      Target.prototype.getBaseUrl = () => {
        return options.baseUrl;
      };
    }
    if (options.headers) {
      Target.prototype.getDefaultHeaders = () => options.headers;
    }
    if ( options.withCredentials ) {
      Target.prototype.isWithCredentials = () => options.withCredentials;
    }
    return Target;
  };
}

interface RestClientArgs {
  serviceId?: string;
  baseUrl?: string;
  headers?: { [header: string]: string | string[] };
  withCredentials?: boolean;
}
