import * as PostmanCollection from 'postman-collection';
import {PostmanTest} from '.';
import { PostmanEnvironmentValue } from './PostmanEnvironment';

/**
 * Extra information relevant to an endpoint
 */
export type DecoratorData =
{
  name?: string;
  script?: string;
  description?: string;
  queryParams?: {[key: string]: string};
  requestParams?: [{value: string; index: number}];
  body?: PostmanCollection.RequestBodyDefinition;
  headers?: PostmanCollection.HeaderDefinition[];
  tests?: PostmanTest;

}