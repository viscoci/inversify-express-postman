import * as PostmanCollection from 'postman-collection';
import { PostmanAuth } from "../../interfaces/PostmanAuth";
import * as rp from 'request-promise';
import { toJSONSchema } from '../../utils/toJSONSchema';
import { PostmanEnvironment } from '../../interfaces/PostmanEnvironment';
import { ApiCollection, ApiEnvironment, ApiWorkspace } from './models/ResponseObject';

const POSTMAN_API_HOST = "https://api.getpostman.com";
const POSTMAN_API = {
    COLLECTIONS: () => `${POSTMAN_API_HOST}/collections`,
    UPDATE_COLLECTION: (collection_uid) => `${POSTMAN_API_HOST}/collections/${collection_uid}`,

    ENVIRONMENTS: () => `${POSTMAN_API_HOST}/environments`,
    UPDATE_ENVIRONMENT: (environment_uid) => `${POSTMAN_API_HOST}/environments/${environment_uid}`,

    API_KEY_OWNER: () => `${POSTMAN_API_HOST}/me`,

    WORKSPACES: () => `${POSTMAN_API_HOST}/workspaces`
}

export class PostmanApi implements PostmanAuth
{
    APIkey: string;

    constructor(apiKey: string)
    {
        this.APIkey = apiKey;
    }

    async ApiKeyOwner(): Promise<string>
    {
        const request = rp(POSTMAN_API.API_KEY_OWNER(), {method: 'GET', headers: {'X-Api-Key': this.APIkey}});

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during API Owner Key retrieval through API`, response.error, response)
            throw new Error();
        }

        return response;
    }

    async ListCollections(): Promise<{collections: Array<ApiCollection>}>
    {
        const request = rp(POSTMAN_API.COLLECTIONS(), {
            method: "GET",
            headers: {
                'X-Api-Key': this.APIkey
            }
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during List Postman Collection through API`, response.error, response);
            throw new Error();
        }

        return <{collections: Array<ApiCollection>}>JSON.parse(response);
    }

    async CreateCollection(collection: PostmanCollection.Collection, workspace?: string): Promise<{collection: ApiCollection}>
    {
        if(collection.name == null || collection.name.length <= 0)
        {
            throw new Error(`Cannot create collection! Ensure the collection's \`name\` property has been set!`);
        }

        let URL = POSTMAN_API.COLLECTIONS();

        if(workspace != null)
        {
            URL += `?workspace=${workspace}`;
        }

        const request = rp(encodeURI(URL), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.APIkey
            },
            body: JSON.stringify({collection: collection.toJSON()})
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during Create Postman Collection through API`, response.error, response);
            throw new Error();
        }

        return <{collection: ApiCollection}> JSON.parse(response);
    }

    async UpdateCollection(collection: PostmanCollection.Collection, cidtoUpdate?: string): Promise<{collection: ApiCollection}>
    {
        const request = rp(POSTMAN_API.UPDATE_COLLECTION(cidtoUpdate || collection.id), {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.APIkey
            },
            body: JSON.stringify({collection: collection.toJSON()})
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during Update Postman Collection through API`, response.error, response);
            throw new Error();
        }

        return <{collection: ApiCollection}>JSON.parse(response);
    }

    async ListEnvironments(): Promise<{environments: Array<ApiEnvironment>}>
    {
        const request = rp(POSTMAN_API.ENVIRONMENTS(), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.APIkey
            }
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during List of Postman Environments through API`, response.error, response);
            throw new Error();
        }

        return <{environments: Array<ApiEnvironment>}>JSON.parse(response);
    }

    async CreateEnvironment(environment: PostmanEnvironment, workspace?: string): Promise<{environment: ApiEnvironment}>
    {

        let URL = POSTMAN_API.ENVIRONMENTS();

        if(workspace != null)
        {
            URL += `?workspace=${workspace}`;
        }

        const request = rp(URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.APIkey
            },
            body: JSON.stringify({environment: environment})
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during Create Postman Environment through API`, response.error, response);
            throw new Error();
        }

        return <{environment: ApiEnvironment}>JSON.parse(response);
    }

    async UpdateEnvironment(environment: PostmanEnvironment, eidtoUpdate?: string): Promise<{environment: ApiEnvironment}>
    {
        const request = rp(POSTMAN_API.UPDATE_ENVIRONMENT(eidtoUpdate || environment.id), {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': this.APIkey
            },
            body: JSON.stringify({environment: environment})
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during Update Postman Environment through API`, response.error, response);
            throw new Error();
        }

        return <{environment: ApiEnvironment}>JSON.parse(response);
    }


    async ListWorkspaces(): Promise<{workspaces: Array<ApiWorkspace>}>
    {
        const request = rp(POSTMAN_API.WORKSPACES(), {
            method: "GET",
            headers: {
                'X-Api-Key': this.APIkey
            }
        });

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during List Postman Workspaces through API`, response.error, response);
            throw new Error();
        }

        return <{workspaces: Array<ApiWorkspace>}>JSON.parse(response);
    }
}
