export function QueryParamReplacer(key: string, value: any): any {

    switch (key) {
        case "query":

            if(Array.isArray(value))
            {
                return value.filter((val: {key: string; value: any}) => {
                    switch(val.key)
                    {
                        case "_postman_listAllowsMultipleValues":
                        case "_postman_listIndexKey":
                        case "Type":
                        case "reference":
                        case "members":
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