import { DecoratorData, Extension } from '../interfaces';
import { controllers, folders } from '..';

/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param data {DecoratorData}
 */
export function PostmanData(data: DecoratorData): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        if(key === undefined)
        {
            if(target.name != null)
            {
                if(folders[target.name] == null)
                {
                    folders[target.name] = data;
                    return;
                }

                folders[target.name] = Object.assign(folders[key], {...data});
                return;
            }
            return;
        }

        // Key is defined, must be a function?
        if(controllers[key] == null)
        {
            controllers[key] = data;
            return;
        }

        controllers[key] = Object.assign(controllers[key], {...data});
    }

    return extended;
}
