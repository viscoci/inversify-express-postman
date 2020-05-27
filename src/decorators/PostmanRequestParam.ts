import { Metadata, setupMetadata } from '..';
import { Extension } from '../interfaces';
import { setupMetaVariant } from '../index';


/**
 * Replace a request parameter with a new value based on either the params prior name or the index at which it sits
 * @param keyIndex Name or left to right index of the param to replace with a value
 * @param paramValue The new value to set
 * @param envVariable Whether to wrap the new value as an Environment variable
 */
export function PostmanRequestParam<ParamValue extends string>(keyIndex: string | number, paramValue: ParamValue, envVariable, variantKey?: string)
export function PostmanRequestParam<ParamValue extends string, VariantKey extends string>(keyIndex: string | number, paramValue: ParamValue, envVariable, variantKey?: VariantKey)
export function PostmanRequestParam<KeyIndex extends string | number, ParamValue extends string, VariantKey extends string>(keyIndex: KeyIndex, paramValue: ParamValue, envVariable = true, variantKey?: VariantKey): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key === undefined)
        {
            if(Metadata.folders[targetName].folder.requestParams == null)
            {
                Metadata.folders[targetName].folder.requestParams = new Array<{value: string; index: string | number}>();
            }

            Metadata.folders[targetName].folder.requestParams.push({index: keyIndex, value: envVariable ? `{{${paramValue}}}` : paramValue});
            return;
        }

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);

            if(Metadata.folders[targetName].controllers[key].variations[variantKey].requestParams == null)
            {
                Metadata.folders[targetName].controllers[key].variations[variantKey].requestParams = new Array<{value: string; index: string | number}>();
            }

            Metadata.folders[targetName].controllers[key].variations[variantKey].requestParams.push({index: keyIndex, value: envVariable ? `{{${paramValue}}}` : paramValue});
        }
        else
        {
            if(Metadata.folders[targetName].controllers[key].requestParams == null)
            {
                Metadata.folders[targetName].controllers[key].requestParams = new Array<{value: string; index: string | number}>();
            }


            Metadata.folders[targetName].controllers[key].requestParams.push({index: keyIndex, value: envVariable ? `{{${paramValue}}}` : paramValue});
        }
    }

    return extended;
}