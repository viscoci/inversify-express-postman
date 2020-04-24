import { Extension } from '../interfaces';
import { Metadata, setupMetadata } from '..';
import { HeaderDefinition, Header } from 'postman-collection';

/**
 * Adds a header
 * @param headerKey
 * @param headerValue
 * @param envVariable If the value should be wrapped as an environment variable
 */
export function PostmanHeader(headerKey: string, headerValue: string, envVariable = true): (target: any, key: string, value: any) => void
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



        if(Metadata.folders[targetName].controllers[key].headers == null)
        {
            Metadata.folders[targetName].controllers[key].headers = new Array<HeaderDefinition>();
        }

        Metadata.folders[targetName].controllers[key].headers.push(<HeaderDefinition>{key: headerKey, value:  envVariable ? `{{${headerValue}}}` : headerValue})
    }

    return extended;
}