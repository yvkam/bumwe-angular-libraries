import {ParameterMetadata} from '../decorators/parameters';

export function buildUrl(baseUrl: string, path: string, pathParamsMetadata: ParameterMetadata[]) {
  const urlTemplate = buildFullUrlTemplate(baseUrl, path);
  return replacePathParams(urlTemplate, pathParamsMetadata);
}

const SLASH = '/';

function buildFullUrlTemplate(baseUrl: string, path: string) {
  if (!baseUrl) {
    return path;
  }

  // Check double slash conflict during the join of the baseUrl and path
  if (baseUrl.endsWith(SLASH) && path.startsWith(SLASH)) {
    return baseUrl.slice(0, -1) + path;
  }

  return baseUrl + path;
}
function replacePathParams(urlTemplate: string, metadata: ParameterMetadata[]): string {
  let url = urlTemplate;
  metadata?.forEach(md => url = replacePathParam(url, md.key, md.value));
  return url;
}

function replacePathParam(url: string, key: string, value: string) {
  if (!value) {
    throw new Error(`Missing path variable '${key}' in path ${url}`);
  }
  return url.replace(`{${key}}`, value);
}
