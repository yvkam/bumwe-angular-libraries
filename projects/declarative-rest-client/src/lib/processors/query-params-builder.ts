import {ParameterMetadata} from '../decorators/parameters';
import {HttpParams} from '@angular/common/http';
import {formatData} from './format-data';

export function buildQueryParams(url: string,
                                 queryParamsMetadata: ParameterMetadata[],
                                 plainQueryParamsMetadata: ParameterMetadata[]): HttpParams {
  let queryParams: HttpParams = new HttpParams();

  if (!queryParamsMetadata) {
    return queryParams;
  }

  queryParamsMetadata
    .filter(m => m.value) // filter out optional parameters
    .forEach(m => {
      const value = stringifyQueryParams(m.value, m.format);
      const values = Array.isArray(value) ? value : [value];
      values.forEach(v => queryParams = queryParams.append(m.key, v));
    });

  return replacePlainQueryParams(url, plainQueryParamsMetadata, queryParams);
}

function stringifyQueryParams(value: any, format: string) {
  if (Array.isArray(value)) {
    return formatData(value, format);
  }

  if (value instanceof Object) {
    return JSON.stringify(value);
  }

  return value;
}

function replacePlainQueryParams(fullUrl: string, metadata: ParameterMetadata[], httpParams: HttpParams): HttpParams {
  let finalHttpParams = httpParams;

  if (!metadata) {
    return finalHttpParams;
  }
  metadata
    .filter(m => m.value) // filter out optional parameters
    .forEach(m => {
      const value: any = m.value;

      if (value instanceof Object) {
        Object.keys(value)
          .forEach(key => finalHttpParams = finalHttpParams.append(key, value[key]));
      } else if (typeof value === 'string') {
        removeLeadingQuestionMark(value).split('&')
          .map(pair => pair.split('='))
          .forEach(([k, v]) => finalHttpParams = finalHttpParams.append(k, v));

      } else {
        throw new Error('Value type is not correct');
      }
    });

  return finalHttpParams;
}


function removeLeadingQuestionMark(value: string) {
  return value.charAt(0) === '?' ? value.substr(1) : value;
}
