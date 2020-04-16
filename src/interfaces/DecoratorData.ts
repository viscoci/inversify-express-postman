import * as PostmanCollection from 'postman-collection';
import { PostmanTests } from '../decorators/PostmanTest';

export interface DecoratorData
{
  name?: string;
  script?: string;
  description?: string;
  queryParams?: {[key: string]: string};
  requestParams?: [{value: string; index: number}];
  body?: PostmanCollection.RequestBodyDefinition;
  headers?: PostmanCollection.HeaderDefinition[];
  tests?: PostmanTests;

}