import * as PostmanCollection from 'postman-collection';
import {PostmanTest} from '.';
import { PostmanEnvironmentValue } from './PostmanEnvironment';
import { raw } from 'express';

/**
 * Type of metadata extensions. Undefined key used to indicate a class
 */
export type Extension = (target: any, key?: string, value?: any) => void;
/**
 * Extra information relevant to an endpoint
 */

export type ResponseDefinition = Omit<PostmanCollection.ResponseDefinition, 'body'> & {body: {value: string; type: "path" | "text"}}
export type RequestBodyDefinition = Omit<PostmanCollection.RequestBodyDefinition, 'raw'> & {raw: {value: string; type: "path" | "text"}}
export type DecoratorData =
{
  name?: string;
  description?: {value: string; type: "path" | "text"};
  queryParams?: {[key: string]: string};
  requestParams?: {value: string; index: number | string}[];
  body?: RequestBodyDefinition;
  headers?: PostmanCollection.HeaderDefinition[];
  tests?: PostmanTest;
  responses?: Array<PostmanCollection.ResponseDefinition | string>;
  parent?: string;

}