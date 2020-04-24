import { Metadata, setupMetadata } from '..';
import { Extension } from '../interfaces';

/**
 * Override the name of the folder group or
 */
export function PostmanName(Name: string): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key == null)
        {

            Metadata.folders[targetName].folder.name = Name;
            return;
        }

        Metadata.folders[targetName].controllers[key].name = Name;
    }

    return extended;
}