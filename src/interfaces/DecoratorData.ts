import * as PostmanCollection from 'postman-collection';
import {PostmanTest} from '.';
import { PostmanEnvironmentValue } from './PostmanEnvironment';

/**
 * Type of metadata extensions. Undefined key used to indicate a class
 */
export type Extension = (target: any, key?: string, value?: any) => void;
/**
 * Extra information relevant to an endpoint
 */
export type DecoratorData =
{
  name?: string;
  description?: {content: string; type: "path" | "text"};
  queryParams?: {[key: string]: string};
  requestParams?: [{value: string; index: number}];
  body?: PostmanCollection.RequestBodyDefinition;
  headers?: PostmanCollection.HeaderDefinition[];
  tests?: PostmanTest;
  responses?: Array<PostmanCollection.ResponseDefinition>;

}