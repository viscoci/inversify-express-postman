import * as PostmanCollection from 'postman-collection';

/**
 * Create an instance of PostmanCollection.Collection from an array of PostmanCollection.ItemGroupDefinitions
 */
export function toPostmanCollection(collection: PostmanCollection.ItemGroupDefinition[], name?: string, id?: string): PostmanCollection.Collection
{
    return new PostmanCollection.Collection({
        item: collection,
        name: name,
        id: id
    });
}