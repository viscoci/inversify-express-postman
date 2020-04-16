import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { controllers } from './decorators/PostmanData';
/*
Goals:
 - Take Express Inversify API and export it to Postman Collection
*/

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 */
export function load(container: Container): PostmanCollection.ItemGroupDefinition[] {
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers);
}



export * as Decorators from './decorators';
export * as Utilities from './utils';