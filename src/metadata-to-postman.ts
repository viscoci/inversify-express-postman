import * as PostmanCollection from 'postman-collection';
import {DecoratorData, Metadata, ExportOptions} from './interfaces';
import { Utilities } from '.';


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

export default async function toPostmanCollectionDefinition(metadata: Metadata[], decoratorData: DecoratorData, options?: ExportOptions): Promise<PostmanCollection.ItemGroupDefinition[]> {
  return await Promise.all(metadata.map(async (controller) => {

    const CollectDef: PostmanCollection.ItemGroupDefinition = {};
    CollectDef.name = controller.controllerMetadata.target.name;
    const basePath = controller.controllerMetadata.path.split(/[\\/]/);

    if(basePath[0] === "")
    {
      basePath.shift();
    }

    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///
    CollectDef.item = await Promise.all(controller.methodMetadata.map(async (endpoint) => {

      const decoratedData: DecoratorData = decoratorData[endpoint.key] || {};
      const nuItemEndpoint: PostmanCollection.Item = new PostmanCollection.Item({name: decoratedData.name || endpoint.key});
      nuItemEndpoint.description = decoratedData.description || "";

      if(decoratedData.tests)
      {
        if(decoratedData.tests.premades && decoratedData.tests.premades.length > 0)
        {
          for(const premade of decoratedData.tests.premades)
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

        if (decoratedData.tests.funcs && decoratedData.tests.funcs.length > 0)
        {
          // Function Obj
          for(const func of decoratedData.tests.funcs)
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

        if(decoratedData.tests.paths && decoratedData.tests.paths.length > 0)
        {
          // TODO : Paths have not been tested
          for(const path of decoratedData.tests.paths)
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
      }


      // Split the path up, locate an params and their indexes. Replace with new value
      const queryParams = new Array<PostmanCollection.QueryParamDefinition>();
      const headers = new Array<PostmanCollection.HeaderDefinition>();
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
            if(decoratedData.queryParams != null)
            {
              if(decoratedData.queryParams[param.parameterName] != null)
              {
                queryParams.push({key: param.parameterName, value: `{{${decoratedData.queryParams[param.parameterName]}}}`});
              }
            }
            break;

          case PARAMETER_TYPE.HEADERS:
            headers.push(<PostmanCollection.HeaderDefinition>{key: param.parameterName, name: param.parameterName});
            break;

          default:
          break;
        }
      }

      const host = new Array<string>();

      if(options != null)
      {
        if(options.hostKey != null && Array.isArray(options.hostKey))
        {
          host.push(...options.hostKey);
        }
        else
        {
          host.push(`{{${options.hostKey}}}`);
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

      return nuItemEndpoint;
    }));
    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///

    return CollectDef;
  }));
}