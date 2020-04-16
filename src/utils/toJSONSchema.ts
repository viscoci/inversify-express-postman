import { Collection } from "postman-collection";
import { QueryParamReplacer } from "./QueryParamReplace";

export function toJSONSchema(collection: Collection, FixQueryParams: boolean, space?: number): string
{
    return JSON.stringify(collection.toJSON(), FixQueryParams ? QueryParamReplacer : null, space);
}