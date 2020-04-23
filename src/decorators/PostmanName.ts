import { controllers, folders } from '..';
import { Extension } from '../interfaces';

/**
 * Override the name of the folder group or
 */
export function PostmanName(Name: string): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const _key = key === undefined ? target.name : key;
        const group = key === undefined ? folders : controllers;

        if(group[_key] == null)
        {
            group[_key] = {};
        }

        group[_key].name = Name;
    }

    return extended;
}