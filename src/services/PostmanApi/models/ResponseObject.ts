
export type ResponseObject = {
    id: string;
    name: string;
    /** Full unique ID */
    uid: string;
}

export interface ApiCollection extends ResponseObject
{
    owner: string;
}

export type ApiEnvironment = ResponseObject;

export type ApiWorkspace = {
    id: string;
    name: string;
    type: "personal" | "team";
}