import { functionStripper, newLineSplitter } from "./functionStripper";

export function toEventExec(val: Function): string[]
{
    return newLineSplitter(functionStripper(val.toString()));
}