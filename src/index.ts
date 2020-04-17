import toPostmanCollectionDefinition from './metadata-to-postman';
import * as PostmanCollection from 'postman-collection';
import * as invExpress from 'inversify-express-utils';
import { Container } from 'inversify';
import { DecoratorData } from './interfaces/DecoratorData';
import { toPostmanCollection } from './utils/toPostmanCollection';
import { toJSONSchema } from './utils';
import { ExportOptions } from './interfaces/ExportOptions';

export * as Types from './interfaces';
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
export async function load(container: Container): Promise<PostmanCollection.ItemGroupDefinition[]>
export async function load(container: Container, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]> {
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers, options);
}

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 */
export async function ContainerToItemGroupArray(container: Container, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]>{
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers, options);
}

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 * @param container Inversify Container with inversify-express injectables
 * @param options Options for specifying a host variable or definite host URL
 */
export async function ContainerToCollection(container: Container, options?: ExportOptions): Promise<PostmanCollection.Collection>
{
    const itemGroup =  await toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers, options);
    return toPostmanCollection(itemGroup);
}

/**
 * Creates a Postman Collection from an inversify container and then stringifies to a JSON
 *
 * Those Params can be removed by specifying @param `FixQueryParams` as true
 *
 * @param container Inversify Container with inversify-express injectables
 * @param options Options for specifying a host variable or definite host URL
 * @param FixQueryParams Fixes potential postman-collection bug where unintended Query Params are included `{defaults as false}`
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export async function ContainerToCollectionJSON(container: Container): Promise<string>
export async function ContainerToCollectionJSON(container: Container, FixQueryParams, space): Promise<string>
export async function ContainerToCollectionJSON(container: Container, FixQueryParams = false, space?: number, options?: ExportOptions ): Promise<string>
{
    console.log('FixQueryParams', FixQueryParams)
    console.log('Space', space);
    const itemGroup = await toPostmanCollectionDefinition(invExpress.getRawMetadata(container), controllers, options);

    return toJSONSchema(toPostmanCollection(itemGroup), FixQueryParams, space);
}
