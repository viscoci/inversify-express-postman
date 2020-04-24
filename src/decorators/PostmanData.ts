import { DecoratorData, Extension } from '../interfaces';
import { Metadata, setupMetadata } from '..';

/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param data {DecoratorData}
 */
export function PostmanData(data: DecoratorData): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key === undefined)
        {
            Metadata.folders[targetName].folder = data;
            return;
        }

        // Key is defined, must be a function?
        if(Metadata.folders[targetName].controllers[key] == null)
        {
            Metadata.folders[targetName].controllers[key] = data;
            return;
        }

        Metadata.folders[targetName].controllers[key] = Object.assign(Metadata.folders[targetName].controllers[key], {...data});
    }

    return extended;
}
