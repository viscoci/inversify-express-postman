import { Collection } from "postman-collection";
import { QueryParamReplacer } from "./QueryParamReplace";

/**
 * Converts the collection to a JSON string and abide by Postman Collection JSON Schema v2.1.0
 * @param collection
 * @param FixQueryParams Whether to remove unwanted values (purpose is to fix bug found in postman-collection)
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export function toJSONSchema(collection: Collection, FixQueryParams = true, space?: number): string
{
    return JSON.stringify(collection.toJSON(), FixQueryParams ? QueryParamReplacer : null, space);
}