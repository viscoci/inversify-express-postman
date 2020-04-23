import { controllers } from '..';
import { Extension } from '../interfaces';

/**
 * Set a query parameter to have its value accept an environment variable which is set by the @param paramValue
 * @param paramName Name / key of the parameter
 * @param paramValue Value the parameter should equal
 * @param envVariable If the value should be wrapped as an environment variable
 */
export function PostmanQueryParam(paramName: string, paramValue: string, envVariable = true): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        if(key === undefined)
        {
            console.warn('Cannot assign headers to a Controller Class', '| Class:', target.name);
            return;
        }
        if(controllers[key] == null)
        {
            controllers[key] = {}
        }

        if(controllers[key].queryParams == null)
        {
            controllers[key].queryParams = {};
        }


        controllers[key].queryParams[paramName] = envVariable ? `{{${paramValue}}}` : paramValue;
    }

    return extended;
}