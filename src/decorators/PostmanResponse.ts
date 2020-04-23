import { ResponseDefinition, HeaderDefinition } from "postman-collection";
import { controllers } from '../index';

export function PostmanResponse(responseDefinition: ResponseDefinition): (target: any, key: string, value: any) => void
{
    const extended = function (target: any, key: string, value: any): void
    {
        if(key === undefined)
        {
            console.warn('Response is not supported for groups');
            return;
        }

        if(controllers[key] == null)
        {
            controllers[key] = {};
        }

        if(controllers[key].responses == null)
        {
            controllers[key].responses = new Array<ResponseDefinition>();
        }


        controllers[key].responses.push(responseDefinition);

    }

    return extended;
}