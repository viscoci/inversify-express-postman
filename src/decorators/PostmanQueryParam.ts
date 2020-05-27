import { Metadata, setupMetadata } from '..';
import { Extension } from '../interfaces';
import { setupMetaVariant } from '../index';

/**
 * Set a query parameter to have its value accept an environment variable which is set by the @param paramValue
 * @param paramName Name / key of the parameter
 * @param paramValue Value the parameter should equal
 * @param envVariable If the value should be wrapped as an environment variable
 */
export function PostmanQueryParam<ParamValue extends string>(paramName: string, paramValue: ParamValue, envVariable?, variantKey?: string)
export function PostmanQueryParam<ParamValue extends string, VariantKey extends string>(paramName: string, paramValue: ParamValue, envVariable?, variantKey?: VariantKey)
export function PostmanQueryParam<ParamName extends string, ParamValue extends string, VariantKey extends string>(paramName: ParamName, paramValue: ParamValue, envVariable = true, variantKey?: VariantKey): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key === undefined)
        {
            console.warn('Cannot assign headers to a Controller Class', '| Class:', targetName);
            return;
        }

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);

            if(Metadata.folders[targetName].controllers[key].variations[variantKey].queryParams == null)
            {
                Metadata.folders[targetName].controllers[key].variations[variantKey].queryParams = {};
            }

            Metadata.folders[targetName].controllers[key].variations[variantKey].queryParams[paramName] = envVariable ? `{{${paramValue}}}` : paramValue;
        }
        else
        {
            if(Metadata.folders[targetName].controllers[key].queryParams == null)
            {
                Metadata.folders[targetName].controllers[key].queryParams = {};
            }

            Metadata.folders[targetName].controllers[key].queryParams[paramName] = envVariable ? `{{${paramValue}}}` : paramValue;
        }
    }

    return extended;
}