import * as PostmanCollection from 'postman-collection';
import {DecoratorData, Metadata, ExportOptions} from './interfaces';
import { Utilities, Decorators } from '.';
import { PostmanTest, PostmanEventTest } from './interfaces/PostmanTest';
import { textFromFile } from './utils';
import { CollectionHandler } from './index';


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

export default async function toPostmanCollectionDefinition(metadata: Metadata[], decoratorData: CollectionHandler, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]> {

  const ItemGroups = new Map<string, PostmanCollection.ItemGroupDefinition>();
  for(const controller of metadata)
  {

  // }
  // return await Promise.all(metadata.map(async (controller) => {

    const tname = controller.controllerMetadata.target.name;

    const folderData = decoratorData.folders[tname].folder || {};

    const basePath = controller.controllerMetadata.path.split(/[\\/]/);
    if(basePath[0] === "")
    {
        basePath.shift();
    }


    const getItemDefinitions = async () => Promise.all(controller.methodMetadata.map(async (endpoint) => {

      const decoratedData: DecoratorData = decoratorData.folders[tname].controllers[endpoint.key] || {};

      const nuItemEndpoint: PostmanCollection.Item = new PostmanCollection.Item({
        name: decoratedData.name || endpoint.key
      });


      //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// TESTS
      //// //// //// //// //// //// TESTS
      const tests: PostmanTest = {
        funcs: new Array<PostmanEventTest<Function>>(),
        paths: new Array<PostmanEventTest<string>>(),
        premades: new Array<PostmanEventTest<string[]>>()
      };

      if(folderData.tests)
      {
        if(folderData.tests.funcs) {tests.funcs.push(...folderData.tests.funcs);}
        if(folderData.tests.paths) {tests.paths.push(...folderData.tests.paths);}
        if(folderData.tests.premades) {tests.premades.push(...folderData.tests.premades);}
      }

      if(decoratedData.tests)
      {
        if(decoratedData.tests.funcs) {tests.funcs.push(...decoratedData.tests.funcs);}
        if(decoratedData.tests.paths) {tests.paths.push(...decoratedData.tests.paths);}
        if(decoratedData.tests.premades) {tests.premades.push(...decoratedData.tests.premades);}
      }

      if(tests.premades.length > 0)
      {
        for(const premade of tests.premades)
        {
          // TODO : Premades (should work) have not been tested
          nuItemEndpoint.events.add(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
            listen: premade.listen,
            script: new PostmanCollection.Script({
              exec: premade.func,
              type: "text/javascript"
            })
          }));
        }
      }

      if (tests.funcs.length > 0)
      {
        // Function Obj
        for(const func of tests.funcs)
        {
          // Currently Supported
          nuItemEndpoint.events.add(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
            listen: func.listen,
            script: new PostmanCollection.Script({
              exec: Utilities.toEventExec(func.func),
              type: "text/javascript"
            })
          }));
        }
      }

      if(tests.paths.length > 0)
      {
        // TODO : Paths have not been tested
        for(const path of tests.paths)
        {
          nuItemEndpoint.events.add(new PostmanCollection.Event(<PostmanCollection.EventDefinition>{
            listen: path.listen,
            script: new PostmanCollection.Script({
              exec: await Utilities.functionFromFile(path.func),
              type: "text/javascript"
            })
          }));
        }
      }
      // // // End TESTS \\ \\ \\
      //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

      //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// Query Params / Headers / Request Params
      //// //// //// //// //// Query Params / Headers / Request Params

      // Split the path up, locate an params and their indexes. Replace with new value
      const queryParams = new Array<PostmanCollection.QueryParamDefinition>();
      const headers = new Array<PostmanCollection.HeaderDefinition>();

      if(decoratedData.headers != null && decoratedData.headers.length > 0)
      {
        headers.push(...decoratedData.headers)
      }

      const splicedPath = endpoint.path.split(/[\\/]/);

      if(splicedPath[0] === "")
      {
        splicedPath.shift();
      }

      for(let i = 0; i < splicedPath.length; i++)
      {
        if(splicedPath[i].startsWith(":"))
        {
          if(decoratedData.requestParams != null && decoratedData.requestParams.length > 0)
          {
            const rIndx = decoratedData.requestParams.findIndex((curObj) => curObj.index === i);
            if(rIndx >= 0)
            {
              splicedPath[i] = `{{${decoratedData.requestParams[rIndx].value}}}`;
            }
            else
            {
              splicedPath[i] = `{{${splicedPath[i].substring(1)}}}`
            }
          }
          else
          {
            splicedPath[i] = `{{${splicedPath[i].substring(1)}}}`
          }

        }
      }

      splicedPath.unshift(...basePath);

      const paramData = controller.parameterMetadata ? controller.parameterMetadata[endpoint.key] : [];
      for(const param of paramData.filter(p => p.type > 1))
      {
        switch(param.type)
        {
          case PARAMETER_TYPE.QUERY:
            {
              if(decoratedData.queryParams != null && decoratedData.queryParams[param.parameterName] != null)
              {
                queryParams.push({key: param.parameterName, value: decoratedData.queryParams[param.parameterName]});
              }
              else
              {
                queryParams.push({key: param.parameterName, value: ''})
              }
            }
            break;

          case PARAMETER_TYPE.HEADERS:
            // TODO : Headers inside the decorated data should be merged
            headers.push(<PostmanCollection.HeaderDefinition>{key: param.parameterName, value: param.parameterName});
            break;

          default:
          break;
        }
      }

      //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\


      //// //// //// //// //// //// //// //// //// //// //// //////// //// //// //// //// //// Host
      //// //// //// //// //// Host
      const host = new Array<string>();

      if(options != null)
      {
        if(options.hostKey != null && Array.isArray(options.hostKey))
        {
          host.push(...options.hostKey);
        }
        else
        {
          host.push(`{{${options.hostKey || 'ROOT_URL'}}}`);
        }
      }
      else
      {
        host.push("{{ROOT_URL}}");
      }

      nuItemEndpoint.request.method = endpoint.method;
      nuItemEndpoint.request.url = new PostmanCollection.Url({
        host: host,
        path: splicedPath,
        query: queryParams
      });

      for(const header of headers)
      {
        nuItemEndpoint.request.headers.add(new PostmanCollection.Header(header));
      }

      if(decoratedData.body != null)
      {
        nuItemEndpoint.request.body = new PostmanCollection.RequestBody(decoratedData.body);
      }

      if(decoratedData.description != null)
      {
        nuItemEndpoint.request.description = decoratedData.description.type === "path" ? await textFromFile(decoratedData.description.content) : decoratedData.description.content
      }

      if(decoratedData.responses && decoratedData.responses.length > 0)
      {
        for(const response of decoratedData.responses)
        {
          if(response.originalRequest == null)
          {
            response.originalRequest = nuItemEndpoint.request.toJSON();
          }
          nuItemEndpoint.responses.add(new PostmanCollection.Response(response));
        }

      }


      return nuItemEndpoint;
    }));

    const iname = folderData.name || tname;
    let description = "";
    if(folderData.description)
    {
      description = folderData.description.type === "path" ? await textFromFile(folderData.description.content) : folderData.description.content || ""
    }

    if(folderData.parent != null)
    {
      let itemGroup = ItemGroups.get(folderData.parent);

      if(itemGroup == null)
      {
        itemGroup = {name: folderData.parent};

      }

      if(itemGroup.item == null)
      {
        itemGroup.item = new Array<PostmanCollection.ItemGroupDefinition | PostmanCollection.ItemDefinition>()
      }



      const foundIndex = itemGroup.item.findIndex((val) => val.name === iname);

      const getItem = async () => {
        return {
          name: iname,
          description: description.length > 0 ? description : "",
          item: await getItemDefinitions()
        }
      }

      if(foundIndex >= 0)
      {
        if((<PostmanCollection.ItemGroupDefinition>itemGroup.item[foundIndex]).item != null)
        {
          (<PostmanCollection.ItemGroupDefinition>itemGroup.item[foundIndex]).item.push(... await getItemDefinitions());
        }
        else
        {
          const item = await getItem();
          item.item.push(new PostmanCollection.Item(itemGroup.item[foundIndex]));

          itemGroup.item[foundIndex] = item;
        }

        if(description.length > 0)
        {
          itemGroup.item[foundIndex].description += ("\n" + description);
        }

      }
      else
      {
        itemGroup.item.push(await getItem());
      }
      ItemGroups.set(folderData.parent, itemGroup);
      continue;
    }

    // Is top level, if group already taken, just adds items and ignores name and description

    const ItemGroup = ItemGroups.get(iname);
    if(ItemGroup == null)
    {
      ItemGroups.set(iname, {
        name: iname,
        description: description.length > 0 ? description : "",
        item: await getItemDefinitions()
      });
    }
    else
    {
      ItemGroup.item.push(...await getItemDefinitions());
      ItemGroups.set(iname, ItemGroup);
    }

    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///
  }

  return Array.from(ItemGroups.values());
}