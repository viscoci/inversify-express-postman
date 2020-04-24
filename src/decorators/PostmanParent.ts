import { Extension } from './../interfaces';
import { Metadata } from '..';
import { setupMetadata } from '../index';

/**
 * Set the group parent
 */
export function PostmanParent(parent: string): (target: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(target === undefined)
        {
            console.warn('Cannot assign a body to a method', 'Method', key);
            return;
        }

        Metadata.folders[targetName].folder.parent = parent;
    }

    return extended;
}