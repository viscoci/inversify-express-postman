import { Metadata, setupMetadata, setupMetaVariant } from '..';
import { Extension } from '../interfaces';

export function PostmanDescription<VariantKey extends string>(description: string, type: "path" | "text" = "text", variantKey?: VariantKey): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key == null)
        {
            Metadata.folders[targetName].folder.description = {value: description, type: type};
            return;
        }

        if(Metadata.folders[targetName].controllers[key] == null)
        {
            Metadata.folders[targetName].controllers[key] = {};
        }

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);
            Metadata.folders[targetName].controllers[key].variations[variantKey].description =  {value: description, type: type};
        }
        else
        {
            Metadata.folders[targetName].controllers[key].description = {value: description, type: type};
        }


    }

    return extended;
}