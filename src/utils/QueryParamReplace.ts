export function QueryParamReplacer(key: string, value: any): any {

    switch (key) {
        case "query":

            if(Array.isArray(value))
            {
                console.log('Found Query Array', value);
                return value.filter((val: {key: string; value: any}) => {
                    switch(val.key)
                    {
                        case "_postman_listAllowsMultipleValues":
                        case "_postman_listIndexKey":
                        case "Type":
                        case "reference":
                        case "members":
                            console.log('Filtering out', val)

                            return false;

                        default:
                            return true;
                    }
                })
            }
            break;

        default:
            break;
    }

    return value;
}