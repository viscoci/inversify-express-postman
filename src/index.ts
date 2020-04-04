import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { controllers } from './Decorators';
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

/**
 * Create an instance of PostmanCollection.Collection from an array of PostmanCollection.ItemGroupDefinitions
 */
export function toPostmanCollection(collection: PostmanCollection.ItemGroupDefinition[]): PostmanCollection.Collection
{
    return new PostmanCollection.Collection({
        item: collection
    });
}

export * from './Decorators';