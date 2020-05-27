import * as PostmanCollection from 'postman-collection';
import { DecoratorData, Metadata, ExportOptions, ResponseDefinition } from './interfaces';
import { Utilities, Decorators } from '.';
import { PostmanTest, PostmanEventTest } from './interfaces/PostmanTest';
import { textFromFile } from './utils';
import { CollectionHandler } from './index';
import * as fs from 'fs';
import { ExternalMetadataHandler } from './services/ExternalMetadata/index';
import { interfaces } from 'inversify-express-utils';
import { DecoratorVariation } from './interfaces/DecoratorData';


enum PARAMETER_TYPE {
    REQUEST = 0,
    RESPONSE = 1,
    PARAMS = 2,
    QUERY = 3,
    BODY = 4,
    HEADERS = 5,
    COOKIES = 6,
    NEXT = 7,
}

async function GenerateNewItemEndopint(controller: Metadata,
    folderData: DecoratorData,
    decoratedData: DecoratorData | DecoratorVariation,
    endpoint: interfaces.ControllerMethodMetadata,
    epName: string,
    basePath: string[],
    options: ExportOptions | undefined,
    originalItem?: PostmanCollection.Item) {


    const nuItemEndpoint: PostmanCollection.Item = new PostmanCollection.Item({
        name: epName
    });


    //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// TESTS
    //// //// //// //// //// //// TESTS
    const tests: PostmanTest = {
        funcs: new Array<PostmanEventTest<Function>>(),
        paths: new Array<PostmanEventTest<string>>(),
        premades: new Array<PostmanEventTest<string[]>>()
    };

    if (folderData.tests) {
        if (folderData.tests.funcs) { tests.funcs.push(...folderData.tests.funcs); }
        if (folderData.tests.paths) { tests.paths.push(...folderData.tests.paths); }
        if (folderData.tests.premades) { tests.premades.push(...folderData.tests.premades); }
    }

    if (decoratedData.tests) {
        if (decoratedData.tests.funcs) { tests.funcs.push(...decoratedData.tests.funcs); }
        if (decoratedData.tests.paths) { tests.paths.push(...decoratedData.tests.paths); }
        if (decoratedData.tests.premades) { tests.premades.push(...decoratedData.tests.premades); }
    }

    const events = new Array<PostmanCollection.Event>();

    if (tests.premades.length > 0) {
        for (const premade of tests.premades) {
            // TODO : Premades (should work) have not been tested
            events.push(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
                listen: premade.listen,
                script: new PostmanCollection.Script({
                    exec: premade.func,
                    type: "text/javascript"
                })
            }));
        }
    }

    if (tests.funcs.length > 0) {
        // Function Obj
        for (const func of tests.funcs) {
            // Currently Supported
            events.push(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
                listen: func.listen,
                script: new PostmanCollection.Script({
                    exec: Utilities.toEventExec(func.func),
                    type: "text/javascript"
                })
            }));
        }
    }

    if (tests.paths.length > 0) {
        // TODO : Paths have not been tested
        for (const path of tests.paths) {
            events.push(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
                listen: path.listen,
                script: new PostmanCollection.Script({
                    exec: await Utilities.functionFromFile(path.func),
                    type: "text/javascript"
                })
            }));
        }
    }

    for (const event of events) {
        if (event.script.exec && event.script.exec.length > 1) {
            nuItemEndpoint.events.add(event);
            continue;
        }

        if (event.script.exec && event.script.exec.length < 2) {
            if (event.script.exec[0].length > 1) {
                nuItemEndpoint.events.add(event);
                continue;
            }
        }

    }


    // // // End TESTS \\ \\ \\
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

    //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// Query Params / Headers / Request Params
    //// //// //// //// //// Query Params / Headers / Request Params

    // Split the path up, locate an params and their indexes. Replace with new value
    const queryParams = new Array<PostmanCollection.QueryParamDefinition>();
    const headers = new Array<PostmanCollection.HeaderDefinition>();



    const splicedPath = endpoint.path.split(/[\\/]/);

    if (splicedPath[0] === "") {
        splicedPath.shift();
    }

    for (let i = 0; i < splicedPath.length; i++) {
        if (splicedPath[i].startsWith(":")) {
            if (decoratedData.requestParams != null && decoratedData.requestParams.length > 0) {
                const rIndx = decoratedData.requestParams.findIndex((curObj) => curObj.index === i || curObj.index === splicedPath[i].substring(1));
                if (rIndx >= 0) {
                    // Decorator handles environment variable or not
                    splicedPath[i] = decoratedData.requestParams[rIndx].value;
                }
                else {
                    splicedPath[i] = `{{${splicedPath[i].substring(1)}}}`
                }
            }
            else {
                splicedPath[i] = `{{${splicedPath[i].substring(1)}}}`
            }

        }
    }

    splicedPath.unshift(...basePath);

    const paramData = controller.parameterMetadata ? controller.parameterMetadata[endpoint.key] : [];
    for (const param of paramData.filter(p => p.type > 1)) {
        switch (param.type) {
            case PARAMETER_TYPE.QUERY:
                {
                    if (decoratedData.queryParams != null && decoratedData.queryParams[param.parameterName] != null) {
                        queryParams.push({ key: param.parameterName, value: decoratedData.queryParams[param.parameterName] });
                    }
                    else {
                        queryParams.push({ key: param.parameterName, value: '' })
                    }
                }
                break;

            case PARAMETER_TYPE.HEADERS:
                // TODO : Headers inside the decorated data should be merged
                headers.push(<PostmanCollection.HeaderDefinition>{ key: param.parameterName, value: param.parameterName });
                break;

            default:
                break;
        }
    }

    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\


    //// //// //// //// //// //// //// //// //// //// //// //////// //// //// //// //// //// Host
    //// //// //// //// //// Host
    const host = new Array<string>();

    if (options != null) {
        if (options.hostKey != null && Array.isArray(options.hostKey)) {
            host.push(...options.hostKey);
        }
        else {
            host.push(`{{${options.hostKey || 'ROOT_URL'}}}`);
        }
    }
    else {
        host.push("{{ROOT_URL}}");
    }

    nuItemEndpoint.request.method = endpoint.method;
    nuItemEndpoint.request.url = new PostmanCollection.Url({
        host: host,
        path: splicedPath,
        query: queryParams
    });


    if (decoratedData.headers != null && decoratedData.headers.length > 0) {

        for(const cuhead of decoratedData.headers)
        {
            const index = headers.findIndex((val) => val.key === cuhead.key)
            if(index >= 0)
            {
                headers[index] = Object.assign(headers[index], cuhead);
            }
            else
            {
                headers.push(cuhead);
            }
        }
    }

    for (const header of headers) {
        nuItemEndpoint.request.headers.add(new PostmanCollection.Header(header));
    }

    if (decoratedData.body != null) {
        const bodyRaw = decoratedData.body.raw.type === "path" ? await textFromFile(decoratedData.body.raw.value) : decoratedData.body.raw.value;


        const body: any = Object.assign({}, { ...decoratedData.body });

        body.raw = bodyRaw;

        if (bodyRaw.length > 0) {
            nuItemEndpoint.request.body = new PostmanCollection.RequestBody(body);
        }

    }

    if (decoratedData.description != null) {
        const desc = decoratedData.description.type === "path" ? await textFromFile(decoratedData.description.value) : decoratedData.description.value
        if (desc.length > 0) {
            nuItemEndpoint.request.description = desc;
        }
    }

    if (decoratedData.responses) {
        if (decoratedData.responses.length > 0) {
            // TODO splitting this into different arrays might be a good idea
            for (const response of <Array<ResponseDefinition>>decoratedData.responses) {
                if (typeof (response) === "string") {
                    continue;
                }
                if (response.originalRequest == null) {
                    response.originalRequest = nuItemEndpoint.request.toJSON();
                }
                (<PostmanCollection.ResponseDefinition>response).body = response.body.type === "path" ? await textFromFile(response.body.value) : response.body.value;


                nuItemEndpoint.responses.add(new PostmanCollection.Response(response));
            }

            for (const respPath of <Array<string>>decoratedData.responses) {

                if (typeof (respPath) !== "string") {
                    continue;
                }
                try {
                    const txtFrmFile = await textFromFile(respPath);
                    if (txtFrmFile.length <= 0) {
                        continue;
                    }
                    const response = <PostmanCollection.ResponseDefinition>JSON.parse(txtFrmFile);

                    if (response.originalRequest == null) {
                        response.originalRequest = nuItemEndpoint.request.toJSON();
                    }

                    if (typeof (response.body) !== "string") {
                        response.body = JSON.stringify(response.body, null, 2);
                    }

                    nuItemEndpoint.responses.add(new PostmanCollection.Response(response));
                } catch (error) {
                    console.error('Error while parsing data from response path', respPath);
                }

            }
        }
    }

    try {
        if(originalItem != null)
        {
            if(nuItemEndpoint.events.count() <= 0)
            {
                for(const ogEvent of originalItem.events.all())
                {
                    nuItemEndpoint.events.add(ogEvent);
                }
            }

            if(nuItemEndpoint.request.headers.count() <= 0)
            {
                for(const ogHeader of originalItem.request.headers.all())
                {
                    nuItemEndpoint.request.headers.add(ogHeader);
                }
            }

            if(nuItemEndpoint.request.body == null)
            {
                nuItemEndpoint.request.body = originalItem.request.body;
            }

            if(nuItemEndpoint.request.description == null)
            {
                nuItemEndpoint.request.description = originalItem.request.description;
            }

            if(nuItemEndpoint.responses.count() <= 0)
            {
                for(const ogResp of originalItem.responses.all())
                {
                    nuItemEndpoint.responses.add(ogResp);
                }
            }
        }
    } catch (error) {
        console.log(`Unknown Error`, error);
    }



    return nuItemEndpoint;
}

const getItemDefinitions = async (controller: Metadata, extmetaHandler: ExternalMetadataHandler, decoratorData: CollectionHandler, tname: string, basePath: string[], options?: ExportOptions) => {

    const folderData = decoratorData.folders[tname].folder || {};
    const map = new Map<string, PostmanCollection.Item>();

    const existsMap = new Map<string, {endpoint: interfaces.ControllerMethodMetadata; methods: Array<string>; created: boolean}>();


    /// Any endpoints that have the same key will have the methods as variations with a key of the method type in all capitals
    for(const endpoint of controller.methodMetadata)
    {
        let exists = existsMap.get(endpoint.key);
        if(exists == null)
        {
            exists = {endpoint, methods: new Array<string>(), created: false};
        }

        exists.methods.push(endpoint.method.toUpperCase());
        existsMap.set(endpoint.key, exists);
    }

    // Now that every method has been accounted for, start creating the endpoints
    for (const endpoint of controller.methodMetadata) {

        const exists = existsMap.get(endpoint.key);
        if(exists == null)
        {
            console.warn(`Somehow the endpoint key is null?`);
            continue;
        }

        if(exists.methods.length > 1)
        {
            if(exists.created)
            {
                console.log(`Variation already created for endpoint`, endpoint.key)
                continue;
            }

            const decorData: DecoratorData = decoratorData.folders[tname].controllers[endpoint.key] || {};

            for(const method of exists.methods)
            {
                if(decorData.variations == null)
                {
                    decorData.variations = {};
                }

                // Make sure the variation exists
                if(decorData.variations[method] == null)
                {
                    decorData.variations[method] = {}
                }

                if(decorData.variations[method].name == null)
                {
                    decorData.variations[method].name = decorData.name || endpoint.key;
                }

                decorData.variations[method].name += " " + method;
            }

            decoratorData.folders[tname].controllers[endpoint.key] = decorData;
        }

        exists.created = true;
        existsMap.set(endpoint.key, exists);

        if (extmetaHandler != null) {
            if (decoratorData.folders[tname].controllers != null) {

                if (decoratorData.folders[tname].controllers[endpoint.key] != null) {
                    if (map.get(decoratorData.folders[tname].controllers[endpoint.key].name || endpoint.key) == null) {
                        extmetaHandler.ProcessEndpointMetaData(controller, decoratorData, endpoint);
                    }
                }
                else if (map.get(endpoint.key) == null) {
                    extmetaHandler.ProcessEndpointMetaData(controller, decoratorData, endpoint);
                }
            }
            else {
                if (map.get(endpoint.key) == null) {
                    extmetaHandler.ProcessEndpointMetaData(controller, decoratorData, endpoint);
                }
            }

        }

        const decoratedData: DecoratorData = decoratorData.folders[tname].controllers[endpoint.key] || {};

        const epName = decoratedData.name || endpoint.key;

        const nuItemEndpoint = await GenerateNewItemEndopint(controller, folderData, decoratedData, endpoint, epName, basePath, options);

        if (decoratedData.variations == null) {
            // If there are no variations, then set the endpoint up
            map.set(nuItemEndpoint.name, nuItemEndpoint);
            continue;
        }

        // If the variants are all various methods of the same endpoint, delete the original and keep the variants (prevents unwanted duplicates)
        let hasNonMethodVariant = false;

        for(const vKey in decoratedData.variations)
        {
            for(const pKey in decoratedData)
            {
                switch(<keyof DecoratorData> pKey)
                {
                    case "parent":
                    case "variations":
                        continue;
                    default:
                        break;
                }
                if(decoratedData.variations[vKey][pKey] == null)
                {
                    // For any properties undefined in the variation, set the variation to have the same values as the original
                    decoratedData.variations[vKey][pKey] = decoratedData[pKey];
                }
            }

            const vName = decoratedData.variations[vKey].name || vKey;
            const endpointClone = Object.assign({}, {...endpoint});

            switch(vKey)
            {
                case "GET":
                case "POST":
                case "PUT":
                case "PATCH":
                case "DELETE":
                case "COPY":
                case "HEAD":
                case "OPTIONS":
                case "LINK":
                case "UNLINK":
                case "PURGE":
                case "LOCK":
                case "UNLOCK":
                case "PROPFIND":
                case "VIEW":
                    console.log(`Variant as other method ${vKey} for ${endpoint.key}`);
                    endpointClone.method = vKey;
                    break;
                default:
                    hasNonMethodVariant = true;
                    break;
            }

            const originalItem = nuItemEndpoint.toJSON();

            const originalItemClone = new PostmanCollection.Item(originalItem)

            const nuItemEndpointVariant = await GenerateNewItemEndopint(controller, folderData, decoratedData.variations[vKey], endpointClone, vName, basePath, options, originalItemClone);


            map.set(nuItemEndpointVariant.name, nuItemEndpointVariant);
        }

        if(hasNonMethodVariant)
        {
            map.set(nuItemEndpoint.name, nuItemEndpoint);
        }
    }

    return Array.from(map.values());
}

export default async function toPostmanCollectionDefinition(metadata: Metadata[], decoratorData: CollectionHandler, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]> {


    let extmetaHandler: ExternalMetadataHandler | undefined;
    if (options.extmeta != null) {
        extmetaHandler = new ExternalMetadataHandler(options.extmeta);
    }

    const ItemGroups = new Map<string, PostmanCollection.ItemGroupDefinition>();
    for (const controller of metadata) {
        if (extmetaHandler != null) {
            extmetaHandler.ProcessFolderMetaData(controller, decoratorData);
        }


        const tname = controller.controllerMetadata.target.name;

        const folderData = decoratorData.folders[tname].folder || {};

        const basePath = controller.controllerMetadata.path.split(/[\\/]/);
        if (basePath[0] === "") {
            basePath.shift();
        }

        for (let i = 0; i < basePath.length; i++) {
            if (basePath[i].startsWith(":")) {
                if (folderData.requestParams != null && folderData.requestParams.length > 0) {
                    const rIndx = folderData.requestParams.findIndex((curObj) => curObj.index === i || curObj.index === basePath[i].substring(1));
                    if (rIndx >= 0) {
                        // Decorator handles environment variable or not
                        basePath[i] = folderData.requestParams[rIndx].value;
                    }
                    else {
                        basePath[i] = `{{${folderData[i].substring(1)}}}`
                    }
                }
                else {
                    basePath[i] = `{{${folderData[i].substring(1)}}}`
                }

            }
        }

        const iname = folderData.name || tname;
        let description = "";
        if (folderData.description) {
            description = folderData.description.type === "path" ? await textFromFile(folderData.description.value) : folderData.description.value || ""
        }

        if (folderData.parent != null) {
            let itemGroup = ItemGroups.get(folderData.parent);

            if (itemGroup == null) {
                itemGroup = { name: folderData.parent };

            }

            if (itemGroup.item == null) {
                itemGroup.item = new Array<PostmanCollection.ItemGroupDefinition | PostmanCollection.ItemDefinition>()
            }



            const foundIndex = itemGroup.item.findIndex((val) => val.name === iname);

            const getItem = async () => {
                return {
                    name: iname,
                    description: description.length > 0 ? description : "",
                    item: await getItemDefinitions(controller, extmetaHandler, decoratorData, tname, basePath, options)
                }
            }

            if (foundIndex >= 0) {
                if ((<PostmanCollection.ItemGroupDefinition>itemGroup.item[foundIndex]).item != null) {
                    (<PostmanCollection.ItemGroupDefinition>itemGroup.item[foundIndex]).item.push(... await getItemDefinitions(controller, extmetaHandler, decoratorData, tname, basePath, options));
                }
                else {
                    const item = await getItem();
                    item.item.push(new PostmanCollection.Item(itemGroup.item[foundIndex]));

                    itemGroup.item[foundIndex] = item;
                }

                if (description.length > 0) {
                    itemGroup.item[foundIndex].description += ("\n" + description);
                }

            }
            else {
                itemGroup.item.push(await getItem());
            }
            ItemGroups.set(folderData.parent, itemGroup);
            continue;
        }

        // Is top level, if group already taken, just adds items and ignores name and description

        const ItemGroup = ItemGroups.get(iname);
        if (ItemGroup == null) {
            ItemGroups.set(iname, {
                name: iname,
                description: description.length > 0 ? description : "",
                item: await getItemDefinitions(controller, extmetaHandler, decoratorData, tname, basePath, options)
            });
        }
        else {
            ItemGroup.item.push(...await getItemDefinitions(controller, extmetaHandler, decoratorData, tname, basePath, options));
            ItemGroups.set(iname, ItemGroup);
        }

        /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///
    }

    return Array.from(ItemGroups.values());
}