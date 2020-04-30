import * as rp from 'request-promise';
import * as fs from 'fs';
import { Utilities } from '..';

/**
 * Takes in a path, retrieves the file (absolute only) and then strips any wrapping
 * @param path Absolute path to the file (must be UTF-8 encoded file)
 */
export async function functionFromFile(path: string): Promise<string[]>
{
    try {
        const r = new RegExp('^(?:[a-z]+:)?//', 'i');
        let fileText = "";
        if(r.test(path))
        {
            // is absolute path

            const request = rp(path);
            request.catch(err => {
                throw new Error(err);
            });

            const body = await request;

            fileText = body;

        }
        else
        {
            if(!fs.existsSync(path))
            {
                throw new Error("throw new Error('invalid path provided')");
            }
            fileText = fs.readFileSync(path, {encoding: 'UTF-8'});
        }

        return Utilities.newLineSplitter(Utilities.functionStripper(fileText));

    } catch (error) {
        console.error('textFromFile failed from path', path);
        return error;
    }

}

export async function textFromFile(path: string): Promise<string>
{
    try {

        const r = new RegExp('^(?:[a-z]+:)?//', 'i');
        let fileText = "";
        if(r.test(path))
        {
            // is absolute path

            const request = rp(path);
            request.catch(err => {
                throw new Error(err);
            });

            const body = await request;

            fileText = body;

        }
        else
        {
            if(!fs.existsSync(path))
            {
                throw new Error("throw new Error('invalid path provided')");
            }
            fileText = fs.readFileSync(path, {encoding: 'UTF-8'});
        }
        return fileText;

    } catch (error) {
        console.error('textFromFile failed from path', path);
        return error;
    }
}