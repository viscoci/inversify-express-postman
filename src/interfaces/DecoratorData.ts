import * as PostmanCollection from 'postman-collection';

export interface DecoratorData
{
  name?: string;
  script?: string;
  description?: string;
  queryParams?: {[key: string]: string};
  requestParams?: [{value: string; index: number}];
  body?: PostmanCollection.RequestBodyDefinition;
  headers?: PostmanCollection.HeaderDefinition[];

}