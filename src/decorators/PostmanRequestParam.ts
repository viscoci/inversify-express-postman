import { Metadata, setupMetadata } from '..';
import { Extension } from '../interfaces';


/**
 * Replace a request parameter with a new value based on either the params prior name or the index at which it sits
 * @param keyIndex Name or left to right index of the param to replace with a value
 * @param paramValue The new value to set
 * @param envVariable Whether to wrap the new value as an Environment variable
 */
export function PostmanRequestParam(keyIndex: number | string, paramValue: string, envVariable = true): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key === undefined)
        {
            console.warn('Cannot assign request parameters to a Controller Class', '| Class:', targetName);
            return;
        }



        if(Metadata.folders[targetName].controllers[key].requestParams == null)
        {
            Metadata.folders[targetName].controllers[key].requestParams = new Array<{value: string; index: string | number}>();
        }


        Metadata.folders[targetName].controllers[key].requestParams.push({index: keyIndex, value: envVariable ? `{{${paramValue}}}` : paramValue});
    }

    return extended;
}