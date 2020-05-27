import { ResponseDefinition } from '../interfaces';
import { Metadata, setupMetadata, setupMetaVariant } from '../index';

export function PostmanResponse<VariantKey extends string>(responseDefinition: ResponseDefinition | string, variantKey?: VariantKey): (target: any, key: string, value: any) => void
{
    const extended = function (target: any, key: string, value: any): void
    {
        if(key === undefined)
        {
            console.warn('Response is not supported for groups');
            return;
        }

        const targetName = setupMetadata(target, key);

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);

            if(Metadata.folders[targetName].controllers[key].variations[variantKey].responses == null)
            {
                Metadata.folders[targetName].controllers[key].variations[variantKey].responses = new Array<ResponseDefinition | string>();
            }

            Metadata.folders[targetName].controllers[key].variations[variantKey].responses.push(responseDefinition);
        }
        else
        {

            if(Metadata.folders[targetName].controllers[key].responses == null)
            {
                Metadata.folders[targetName].controllers[key].responses = new Array<ResponseDefinition | string>();
            }

            Metadata.folders[targetName].controllers[key].responses.push(responseDefinition);
        }


    }

    return extended;
}