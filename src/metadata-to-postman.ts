import { interfaces } from 'inversify-express-utils';
import * as PostmanCollection from 'postman-collection';
import {DecoratorData} from './interfaces';

export interface Metadata {
  controllerMetadata: interfaces.ControllerMetadata;
  methodMetadata: interfaces.ControllerMethodMetadata[];
  parameterMetadata: interfaces.ControllerParameterMetadata;
}

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

export interface ExportOptions
{
  /**
   * The value or path hosting the endpoints.
   * @type {string} Treated as a variable
   * @type {string[]} Treated as a split host path.
   */
  hostKey: string | string[];

  /**
   * When specifying a host path, a protocol must also be specified
   */
  hostProtocol?: "http" | "https";
}


export default function toPostmanCollectionDefinition(metadata: Metadata[], decoratorData: DecoratorData, options?: ExportOptions): PostmanCollection.ItemGroupDefinition[] {
  return metadata.map((controller) => {

    const CollectDef: PostmanCollection.ItemGroupDefinition = {};
    CollectDef.name = controller.controllerMetadata.target.name;
    const basePath = controller.controllerMetadata.path.split(/[\\\/]/);

    if(basePath[0] === "")
    {
      basePath.shift();
    }

    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///
    CollectDef.item = controller.methodMetadata.map((endpoint) => {

      const decoratedData: DecoratorData = decoratorData[endpoint.key] || {};
      const nuItemEndpoint: PostmanCollection.ItemDefinition = {name: decoratedData.name || endpoint.key};
      nuItemEndpoint.description = decoratedData.description || "";

      // Split the path up, locate an params and their indexes. Replace with new value
      const queryParams = new Array<PostmanCollection.QueryParamDefinition>();
      const headers = new Array<PostmanCollection.HeaderDefinition>();
      const splicedPath = endpoint.path.split(/[\\\/]/);

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

      nuItemEndpoint.request = {
        method: endpoint.method,
        url: new PostmanCollection.Url({
          host: host,
          path: splicedPath,
          query: queryParams
        }),
        header: headers
      };

      if(decoratedData.body != null)
      {
        nuItemEndpoint.request.body = decoratedData.body;
      }

      return nuItemEndpoint;
    });
    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///

    return CollectDef;
  });
}