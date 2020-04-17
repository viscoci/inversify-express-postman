import * as PostmanCollection from 'postman-collection';
import { PostmanAuth } from "./interfaces/PostmanAuth";
import * as rp from 'request-promise';
import { toJSONSchema } from './utils/toJSONSchema';
import { PostmanEnvironment } from './interfaces/PostmanEnvironment';

const POSTMAN_API_HOST = "https://api.getpostman.com";
const POSTMAN_API = {
    CREATE_COLLECTION: () => `${POSTMAN_API_HOST}/collections`,
    UPDATE_COLLECTION: (collection_uid) => `${POSTMAN_API_HOST}/collections/${collection_uid}`,

    CREATE_ENVIRONMENT: () => `${POSTMAN_API_HOST}/environments`,
    UPDATE_ENVIRONMENT: (environment_uid) => `${POSTMAN_API_HOST}/environments/${environment_uid}`,

    API_KEY_OWNER: () => `${POSTMAN_API_HOST}/me`
}

export class PostmanApi implements PostmanAuth
{
    APIkey: string;

    constructor(apiKey: string)
    {
        this.APIkey = apiKey;
    }

    async ApiKeyOwner()
    {
        const request = rp(POSTMAN_API.API_KEY_OWNER(), {method: 'GET', headers: {'X-Api-Key': this.APIkey}});

        request.catch(error => console.error(error));

        const response = await request;

        if(response.error)
        {
            console.error(`Failed during API Owner Key retrieval through API`, response.error, response)
        }

        return response;
    }

    async CreateCollection(collection: PostmanCollection.Collection)
    {
        const request = rp(POSTMAN_API.CREATE_COLLECTION(), {
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
        }

        return response;
    }

    async UpdateCollection(collection: PostmanCollection.Collection, cidtoUpdate?: string)
    {
        const request = rp(POSTMAN_API.UPDATE_COLLECTION(cidtoUpdate || collection.id), {
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
        }

        return response;
    }

    async CreateEnvironment(environment: PostmanEnvironment)
    {
        const request = rp(POSTMAN_API.CREATE_COLLECTION(), {
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
            console.error(`Failed during Create Postman Collection through API`, response.error, response);
        }

        return response;
    }

    async UpdateEnvironment(environment: PostmanEnvironment, eidtoUpdate?: string)
    {
        const request = rp(POSTMAN_API.UPDATE_COLLECTION(eidtoUpdate || environment.id), {
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
            console.error(`Failed during Update Postman Collection through API`, response.error, response);
        }

        return response;
    }
}