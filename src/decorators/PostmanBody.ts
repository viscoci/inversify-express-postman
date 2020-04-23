import { Extension } from './../interfaces';
import { controllers, folders } from '..';

/**
 * Set the body content as raw text
 *
 * *Don't forget to add the header for the Content-Type*
 */
export function PostmanBodyRaw(raw: string): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key: string, value: any): void
    {
        if(key === undefined)
        {
            console.warn('Cannot assign a body to a Controller Class', 'Class', target.name);
            return;
        }
        if(controllers[key] == null)
        {
            controllers[key] = {}
        }

        controllers[key].body = {mode: "raw", raw: raw};
    }

    return extended;
}