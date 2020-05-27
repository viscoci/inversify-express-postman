import { Metadata, setupMetadata, setupMetaVariant } from '..';
import { Extension } from '../interfaces';

/**
 * Override the name of the folder group or
 */
export function PostmanName<VariantKey extends string>(Name: string, variantKey?: VariantKey): Extension
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

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);

            Metadata.folders[targetName].controllers[key].variations[variantKey].name = Name;
        }

        Metadata.folders[targetName].controllers[key].name = Name;
    }

    return extended;
}