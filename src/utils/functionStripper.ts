
/**
 * Removes the wrapping of a function e.g. `function *** () {` or `() => {` and removes closing `}`
 * @param value Function.toString();
 */
export function functionStripper(value: string): string
{
    let nuval = value;
    if (value.startsWith("function") || value.startsWith('(') ||value.startsWith("TEST") || value.startsWith("PREREQUEST")) {
        nuval = value.substring(value.indexOf("{") + 1);
        return nuval.substring(0, nuval.lastIndexOf("}") - 1);
    }

    return nuval;

}

/**
 * Splits string into array based on new line breaks
 * @param value
 */
export function newLineSplitter(value: string): string[]
{
    return value.split(/\r?\n/);
}