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
export * as Utilities from './utils';
export * as Services from './services';
// export const controllers: {[key: string]: DecoratorData} = {};
// export const folders: {[key: string]: DecoratorData} = {};

export type TargetObject = {

    folder: DecoratorData;
    controllers: {
        [key: string]: DecoratorData;
    };
}

export type CollectionHandler = {
    knownGroups: string[];
    folders: {
        [targetname: string]: TargetObject;
    };

}

export const Metadata: CollectionHandler = {knownGroups: new Array<string>(), folders: {}}

/**
 * Handles any undefined elements and merges undefined groups into the next defined target
 */
export function setupMetadata(target: any, keyName?: string)
{
    const setup = (targetName: string) =>
    {
        //console.log(JSON.stringify(Metadata.folders[targetName], null, 2));
        if(Metadata.folders[targetName] == null)
        {
            Metadata.folders[targetName] = {folder: {}, controllers: {}}
        }

        if(keyName == null)
        {
            if(Metadata.folders["undefined"] != null && Metadata.folders["undefined"].controllers != null)
            {
                Metadata.folders[targetName].controllers = Object.assign(Metadata.folders[targetName].controllers, {...Metadata.folders["undefined"].controllers})
                delete Metadata.folders["undefined"].controllers;
            }
            return targetName;
        }

        if(Metadata.folders[targetName].controllers == null)
        {
            Metadata.folders[targetName].controllers = {};
        }

        if(Metadata.folders[targetName].controllers[keyName] == null)
        {
            Metadata.folders[targetName].controllers[keyName] = {};
        }

        return targetName;
    }

    return setup(target.name);

}

export function setupMetaVariant(targetName: any, key: string, variantKey: string)
{
    if(Metadata.folders[targetName].controllers[key].variations == null)
    {
        Metadata.folders[targetName].controllers[key].variations = {};
    }

    if(Metadata.folders[targetName].controllers[key].variations[variantKey] == null)
    {
        Metadata.folders[targetName].controllers[key].variations[variantKey] = {};
    }
}

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
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), Metadata, options);
}

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 */
export async function ContainerToItemGroupArray(container: Container, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]>{
    return toPostmanCollectionDefinition(invExpress.getRawMetadata(container), Metadata, options);
}

/**
 * Load the container data. Use inversify-express-utils decorators to get more data for endpoints
 * {@link https://github.com/inversify/inversify-express-utils#decorators}
 * @param container Inversify Container with inversify-express injectables
 * @param options Options for specifying a host variable or definite host URL
 */
export async function ContainerToCollection(container: Container, options?: ExportOptions): Promise<PostmanCollection.Collection>
{
    const itemGroup =  await toPostmanCollectionDefinition(invExpress.getRawMetadata(container), Metadata, options);
    return toPostmanCollection(itemGroup, options.name, options.uid);
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
    const itemGroup = await toPostmanCollectionDefinition(invExpress.getRawMetadata(container), Metadata, options);

    return toJSONSchema(toPostmanCollection(itemGroup, options.name, options.uid), FixQueryParams, space);
}
