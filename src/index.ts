import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { DecoratorData } from './interfaces/DecoratorData';
import { toPostmanCollection } from './utils/toPostmanCollection';
import { toJSONSchema } from './utils';

export * as Decorators from './decorators';
export * as Utilities from './utils'
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

/**
 * Load the container data out to desired output.
*/
export async function ContainerToCollection(container: Container, returnType: "collection" | "json" | "json2" | "jsonQueryFix" | "jsonQueryFix2" | "itemGroups" = "collection"): Promise<PostmanCollection.Collection | string | PostmanCollection.ItemGroupDefinition[]>
{
    const itemGroup =  await load(container);

    switch(returnType)
    {
        case "itemGroups":
            return itemGroup;
        case "collection":
            return toPostmanCollection(itemGroup);
        case "json":
            return toJSONSchema(toPostmanCollection(itemGroup), false);
        case "json2":
            return toJSONSchema(toPostmanCollection(itemGroup), false, 2);
        case "jsonQueryFix":
            return toJSONSchema(toPostmanCollection(itemGroup));
        case "jsonQueryFix2":
            return toJSONSchema(toPostmanCollection(itemGroup), true, 2);
    }
}