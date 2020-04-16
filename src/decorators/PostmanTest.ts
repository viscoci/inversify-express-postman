import { controllers } from '..';

export type PostmanEventListen = "test" | "prerequest";

export type PostmanPathTest = {
    path: string;
    listen: PostmanEventListen;
}

export type PostmanFuncTest = {
    func: Function;
    listen: PostmanEventListen;
}

export type PostmanPremadeTest = {
    lines: string[];
    listen: PostmanEventListen;
}

export type PostmanTests = {
    paths?: Array<PostmanPathTest>;
    funcs?: Array<PostmanFuncTest>;
    premades?: Array<PostmanPremadeTest>;
}

/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param test {string} Path to a text file containing a postman test script
 * @param test {any} An object (presumably a function) to include as a postman test script
 * @param params {any[]} An params to include with
 */
export function PostmanTests({paths, funcs, premades}: PostmanTests): (target: any, key: string, value: any) => void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key: string, value: any): void
    {
        if(controllers[key] == undefined)
        {
            controllers[key] = {};
        }

        controllers[key].tests = {paths, funcs, premades};

    }

    return extended;
}

/**
 * Adds a single test function to an endpoint for exporting
 * @param func {Function} Javascript safe function in which the wrapped code will be taken from
 * @param listen {PostmanEventListen} When the test script should be called (usually is either `test` or `prerequest`)
 */
export function PostmanTestFromFunction(listen: PostmanEventListen, func: Function)
{
    const extended = function (target: any, key: string, value: any): void
    {
        if(controllers[key] == undefined)
        {
            controllers[key] = {};
        }

        if(controllers[key].tests == undefined)
        {
            controllers[key].tests = {};
        }

        if(controllers[key].tests.funcs == undefined)
        {
            controllers[key].tests.funcs = new Array<PostmanFuncTest>();
        }

        controllers[key].tests.funcs.push({func: func, listen: listen});
    }

    return extended;
}