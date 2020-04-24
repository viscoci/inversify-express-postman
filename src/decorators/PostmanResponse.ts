import { ResponseDefinition, HeaderDefinition } from "postman-collection";
import { Metadata, setupMetadata } from '../index';

export function PostmanResponse(responseDefinition: ResponseDefinition): (target: any, key: string, value: any) => void
{
    const extended = function (target: any, key: string, value: any): void
    {
        if(key === undefined)
        {
            console.warn('Response is not supported for groups');
            return;
        }

        const targetName = setupMetadata(target, key);

        if(Metadata.folders[targetName].controllers[key].responses == null)
        {
            Metadata.folders[targetName].controllers[key].responses = new Array<ResponseDefinition>();
        }

        Metadata.folders[targetName].controllers[key].responses.push(responseDefinition);

    }

    return extended;
}