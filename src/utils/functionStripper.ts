export function functionStripper(value: string): string
{
    let nuval;
    if (value.startsWith("function") || value.startsWith('(')) {
        nuval = value.substring(value.indexOf("{") + 1);
    }
    return nuval.substring(0, nuval.lastIndexOf("}") - 1);
}

export function newLineSplitter(value: string): string[]
{
    return value.split(/\r?\n/);
}