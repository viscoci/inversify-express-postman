import rp from 'request-promise';
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
            request.catch(err => console.error(err));

            const body = await request;

            fileText = body;

        }
        else
        {
            fileText = fs.readFileSync(path, {encoding: 'UTF-8'});
        }

        return Utilities.newLineSplitter(Utilities.functionStripper(fileText));

    } catch (error) {
        console.log('fileFromPath failed', error);
    }

}