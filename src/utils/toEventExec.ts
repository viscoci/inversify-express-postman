import { functionStripper, newLineSplitter } from "./functionStripper";

/**
 * Strips a function of `function *** () {` or `() => {` and removes the `}` wrapping it.
 * Then splits into array based on each new line.
 *
 * Converts function into the format necessary for Postman Event scripts
 * @param val
 */
export function toEventExec(val: Function): string[]
{
    return newLineSplitter(functionStripper(val.toString()));
}