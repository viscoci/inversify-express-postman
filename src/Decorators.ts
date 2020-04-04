import { DecoratorData } from './interfaces';
export const controllers = {};

export function PostmanData(data: DecoratorData): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key: string, value: any): void
    {
        controllers[key] = data;
    }

    return extended;
}