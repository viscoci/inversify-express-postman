import { Extension } from '../interfaces';
import { Metadata, setupMetadata } from '..';
import { HeaderDefinition, Header } from 'postman-collection';
import { setupMetaVariant } from '../index';

/**
 * Adds a header
 * @param headerKey
 * @param headerValue
 * @param envVariable If the value should be wrapped as an environment variable
 */
export function PostmanHeader(headerKey: string, headerValue: string, envVariable = true, variantKey?: string): (target: any, key: string, value: any) => void
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
            if(Metadata.folders[targetName].controllers[key].variations[variantKey].headers == null)
            {
                Metadata.folders[targetName].controllers[key].variations[variantKey].headers = new Array<HeaderDefinition>();
            }

            Metadata.folders[targetName].controllers[key].variations[variantKey].headers.push(<HeaderDefinition>{
                key: headerKey,
                value: envVariable ? `{{${headerValue}}}` : headerValue
            });
        }
        else
        {

            if(Metadata.folders[targetName].controllers[key].headers == null)
            {
                Metadata.folders[targetName].controllers[key].headers = new Array<HeaderDefinition>();
            }

            Metadata.folders[targetName].controllers[key].headers.push(<HeaderDefinition>{
                key: headerKey,
                value:  envVariable ? `{{${headerValue}}}` : headerValue
            });
        }
    }

    return extended;
}