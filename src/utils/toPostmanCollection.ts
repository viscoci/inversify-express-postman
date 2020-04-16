import * as PostmanCollection from 'postman-collection';

/**
 * Create an instance of PostmanCollection.Collection from an array of PostmanCollection.ItemGroupDefinitions
 */
export function toPostmanCollection(collection: PostmanCollection.ItemGroupDefinition[]): PostmanCollection.Collection
{
    return new PostmanCollection.Collection({
        item: collection
    });
}