import { controllers, folders } from '..';
import {PostmanTest, PostmanEventListen, PostmanPathTest, PostmanPremadeTest, PostmanFuncTest, Extension } from '../interfaces'


/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param test {string} Path to a text file containing a postman test script
 * @param test {any} An object (presumably a function) to include as a postman test script
 * @param params {any[]} An params to include with
 */
export function PostmanTests({paths, funcs, premades}: PostmanTest): Extension
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

        group[_key].tests = {paths, funcs, premades};

    }

    return extended;
}

/**
 * Adds a single test function to an endpoint for exporting based on a function that starts with
 * `function` | `TEST` | `PREREQUEST` | `(`
 * @param func {Function} Javascript safe function in which the wrapped code will be taken from. Name must start with either
 * @param listen {PostmanEventListen} When the test script should be called (usually is either `test` or `prerequest`)
 */
export function PostmanTestFunction(listen: PostmanEventListen, func: Function | string | string[]): Extension
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

        if(group[_key].tests == null)
        {
            group[_key].tests = {};
        }

        if(typeof(func) === "string")
        {
            if(group[_key].tests.paths == null)
            {
                group[_key].tests.paths = new Array<PostmanPathTest>();
            }

            group[_key].tests.paths.push({func, listen});
        }
        else if (Array.isArray(func))
        {
            if(group[_key].tests.premades == null)
            {
                group[_key].tests.premades = new Array<PostmanPremadeTest>();
            }

            group[_key].tests.premades.push({func, listen});
        }

        else {

            if(group[_key].tests.funcs == null)
            {
                group[_key].tests.funcs = new Array<PostmanFuncTest>();
            }

            group[_key].tests.funcs.push({func, listen});
        }
    }

    return extended;
}