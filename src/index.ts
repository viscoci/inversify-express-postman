import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { controllers } from './Decorators';
/*
Goals:
 - Take Express Inversify API and export it to Postman Collection
 - Make the entire thing injectable


*/



/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 * @param container
 */
export function load(container: Container): PostmanCollection.ItemGroupDefinition[] {
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers);
}


export function toPostmanCollection(collection: PostmanCollection.ItemGroupDefinition[]): PostmanCollection.Collection
{
    return new PostmanCollection.Collection({
        item: collection
    });
}

export * from './Decorators';