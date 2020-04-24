import { Extension } from './../interfaces';
import { Metadata } from '..';
import { setupMetadata } from '../index';

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
        const targetName = setupMetadata(target, key);
        if(key === undefined)
        {
            console.warn('Cannot assign a body to a Controller Class', 'Class', targetName);
            return;
        }



        Metadata.folders[targetName].controllers[key].body = {mode: "raw", raw: raw};
    }

    return extended;
}