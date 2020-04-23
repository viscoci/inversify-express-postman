import { controllers, folders } from '..';
import { Extension } from '../interfaces';

export function PostmanDescription(description: string, type: "path" | "text" = "text"): Extension
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

        group[_key].description = {content: description, type: type};
    }

    return extended;
}