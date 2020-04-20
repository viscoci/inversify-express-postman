/** ISO Date as a string */
export type ISOdate = string;

export interface PostmanEnvironmentValue
{
    key: string;
    value: string;
    enabled: boolean;
}

export interface PostmanEnvironment
{
    id: string;
    name: string;
    values: PostmanEnvironmentValue[];
    _postman_variable_scope?: "environment";
    _postman_exported_at?: ISOdate;
    _postman_exported_using?: string;
}