import { DecoratorData } from './interfaces';
export const controllers = {};

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