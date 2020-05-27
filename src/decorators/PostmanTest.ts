import { Metadata, setupMetadata } from '..';
import {PostmanTest, PostmanEventListen, PostmanPathTest, PostmanPremadeTest, PostmanFuncTest, Extension } from '../interfaces'
import { setupMetaVariant } from '../index';


/**
 * Decorator used to add Postman data to an endpoint for exporting
 * @param test {string} Path to a text file containing a postman test script
 * @param test {any} An object (presumably a function) to include as a postman test script
 * @param params {any[]} An params to include with
 */
export function PostmanTests<VariantKey extends string>({paths, funcs, premades}: PostmanTest, variantKey?: VariantKey): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);

        if(key == null)
        {
            Metadata.folders[targetName].folder.tests = {paths, funcs, premades};
            return;
        }

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);
            Metadata.folders[targetName].controllers[key].variations[variantKey].tests = {paths, funcs, premades};
        }
        else
        {
            Metadata.folders[targetName].controllers[key].tests = {paths, funcs, premades};
        }
    }

    return extended;
}

/**
 * Adds a single test function to an endpoint for exporting based on a function that starts with
 * `function` | `TEST` | `PREREQUEST` | `(`
 * @param func {Function} Javascript safe function in which the wrapped code will be taken from. Name must start with either
 * @param listen {PostmanEventListen} When the test script should be called (usually is either `test` or `prerequest`)
 */
export function PostmanTestFunction<FunctionPath extends string>(listen: PostmanEventListen, func: Function | FunctionPath | string[], variantKey?: string)
export function PostmanTestFunction<FunctionPath extends string, VariantKey extends string>(listen: PostmanEventListen, func: Function | FunctionPath | string[], variantKey?: VariantKey): Extension
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extended = function (target: any, key?: string, value?: any): void
    {
        const targetName = setupMetadata(target, key);
        if(key == null)
        {

            if(Metadata.folders[targetName].folder.tests == null)
            {
                Metadata.folders[targetName].folder.tests = {};
            }

            if(typeof(func) === "string")
            {
                if(Metadata.folders[targetName].folder.tests.paths == null)
                {
                    Metadata.folders[targetName].folder.tests.paths = new Array<PostmanPathTest>();
                }

                Metadata.folders[targetName].folder.tests.paths.push({func, listen});
            }
            else if (Array.isArray(func))
            {
                if(Metadata.folders[targetName].folder.tests.premades == null)
                {
                    Metadata.folders[targetName].folder.tests.premades = new Array<PostmanPremadeTest>();
                }

                Metadata.folders[targetName].folder.tests.premades.push({func, listen});
            }
            else {

                if(Metadata.folders[targetName].folder.tests.funcs == null)
                {
                    Metadata.folders[targetName].folder.tests.funcs = new Array<PostmanFuncTest>();
                }

                Metadata.folders[targetName].folder.tests.funcs.push({func, listen});
            }

            return;
        }

        if(variantKey != null)
        {
            setupMetaVariant(targetName, key, variantKey);

            if(Metadata.folders[targetName].controllers[key].variations[variantKey].tests == null)
            {
                Metadata.folders[targetName].controllers[key].variations[variantKey].tests = {};
            }

            if(typeof(func) === "string")
            {
                if(Metadata.folders[targetName].controllers[key].variations[variantKey].tests.paths == null)
                {
                    Metadata.folders[targetName].controllers[key].variations[variantKey].tests.paths = new Array<PostmanPathTest>();
                }

                Metadata.folders[targetName].controllers[key].variations[variantKey].tests.paths.push({func, listen});
            }
            else if (Array.isArray(func))
            {
                if(Metadata.folders[targetName].controllers[key].variations[variantKey].tests.premades == null)
                {
                    Metadata.folders[targetName].controllers[key].variations[variantKey].tests.premades = new Array<PostmanPremadeTest>();
                }

                Metadata.folders[targetName].controllers[key].variations[variantKey].tests.premades.push({func, listen});
            }

            else {

                if(Metadata.folders[targetName].controllers[key].variations[variantKey].tests.funcs == null)
                {
                    Metadata.folders[targetName].controllers[key].variations[variantKey].tests.funcs = new Array<PostmanFuncTest>();
                }

                Metadata.folders[targetName].controllers[key].variations[variantKey].tests.funcs.push({func, listen});
            }

        }
        else
        {
            if(Metadata.folders[targetName].controllers[key].tests == null)
            {
                Metadata.folders[targetName].controllers[key].tests = {};
            }

            if(typeof(func) === "string")
            {
                if(Metadata.folders[targetName].controllers[key].tests.paths == null)
                {
                    Metadata.folders[targetName].controllers[key].tests.paths = new Array<PostmanPathTest>();
                }

                Metadata.folders[targetName].controllers[key].tests.paths.push({func, listen});
            }
            else if (Array.isArray(func))
            {
                if(Metadata.folders[targetName].controllers[key].tests.premades == null)
                {
                    Metadata.folders[targetName].controllers[key].tests.premades = new Array<PostmanPremadeTest>();
                }

                Metadata.folders[targetName].controllers[key].tests.premades.push({func, listen});
            }

            else {

                if(Metadata.folders[targetName].controllers[key].tests.funcs == null)
                {
                    Metadata.folders[targetName].controllers[key].tests.funcs = new Array<PostmanFuncTest>();
                }

                Metadata.folders[targetName].controllers[key].tests.funcs.push({func, listen});
            }
        }


    }

    return extended;
}