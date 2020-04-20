import { DecoratorData } from '../interfaces';
import { controllers } from '..';
import { HeaderDefinition, Header } from 'postman-collection';

/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param data {DecoratorData}
 */
export function PostmanData(data: DecoratorData): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key: string, value: any): void
    {
        controllers[key] = data;
    }

    return extended;
}

export function PostmanHeader(headerKey: string, headerValue: string)
{
    const extended = function (target: any, key: string, value: any): void
    {
        if(controllers[key] == null)
        {
            controllers[key] = {}
        }

        if(controllers[key].headers == null)
        {
            controllers[key].headers = new Array<HeaderDefinition>();
        }

        controllers[key].headers.push(<HeaderDefinition>{key: headerKey, headerValue: value})
    }
}