import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { DecoratorData } from './interfaces/DecoratorData';
export const controllers: {[key: string]: DecoratorData} = {};
/*
Goals:
 - Take Express Inversify API and export it to Postman Collection
*/

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 */
export async function load(container: Container): Promise<PostmanCollection.ItemGroupDefinition[]> {
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers);
}



export * as Decorators from './decorators';
export * as Utilities from './utils';