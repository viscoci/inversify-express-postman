# inversify-express-postman
**Package is not finished yet and breaking changes are likely  until `v1.0.0` is released.**
Export [inversify-express-utils] metadata to a [Postman Collection] and sync with the [Postman API]()


[![NPM](https://nodei.co/npm/inversify-express-postman.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-express-postman/)

|                       Contents                        |                         Examples                      |
| ----------------------------------------------------- |:-----------------------------------------------------:|
| [Getting Started](#getting-started)                   | [Container to JSON](#container-to-json)               |
| [Decorators](#decorators)                             | [Decorator Example](#decorator-example)               |
| [Syncing with Postman API](#syncing-with-postman-api) | [PostmanApi Example](#postmanapi-example)             |
| [Adding Test Scripts](#adding-test-scripts)           | [Test Script Example](#prequest-and-test-example)     |
___

### Getting Started
Once a container has been setup, use one of the top level functions to convert the metadata from the container's express endpoints to a Postman Collection or a JSON of the Collection.

In this example, a container is passed in and a JSON string is returned and logged to the console.

##### Container to JSON
```ts
import { Container } from 'inversify';
import * as IEPostman from 'inversify-express-postman';

const container = new Container();

container.bind<SomeAPIModel>(TYPES.SomeAPIModelService)
    .to(SomeAPIModelService).inSingletonScope();

const server = new InversifyExpressServer(diContainer, ...);
// Start the server before passing the container to inversify-express-postman
// Prints to console the JSON with 2 space indentation
IEPostman.ContainerToCollectionJSON(container, false, 2)
    .then(console.log)
    .catch(console.error);
```

All of the endpoints are split up by their controllers as folders and the endpoints as children of the controllers.

To add more information about an endpoint, utilize the [@Decorators](https://github.com/inversify/inversify-express-utils#decorators) included with [inversify-express-utils]. (Some Decorator metadata isn't handled yet)

### Decorators
The [PostmanData](./src/decorators/PostmanData.ts) decorator allows the entry of some more Postman Collection supported items. There are a variety of decorators that can be used jointly. A few decorators can be applied to the class controllers. Console warnings should appear if a decorator is not supported. Typescript typings should give an error for any Decorators that won't work on a class.

 The example below shows some valid usage of the included decorators.
##### Decorator Example
```ts
import {PostmanBodyRaw, PostmanName, PostmanHeader, PostmanDescription, PostmanResponse } from 'inversify-express-postman/decorators';

@controller("/api/v1/example", LOGGER_TYPES.LoggerMiddleWare)
@PostmanName("API v1 | Example") // Names the Folder
@PostmanDescription(path.join(__dirname, "store.md"), "path") // Read in a markdown file and set it as the description
export class ExampleAPIv1Controller extends ControllerBase {
    ...

    @PostmanName("Store Data") // Names the Request
    @PostmanBodyRaw(JSON.stringify({bodyText: "Here is the body text", environmentVariable: "{{ENVIRONMENT_VARIABLE}}"}, null, 2))
    @PostmanHeader('Content-Type', 'application/json', false) // False so the value does not get wrapped as an environment variable
    @PostmanDescription("An example endpoint that stores something")
    @PostmanResponse({code: 200, responseTime: 200, body: "{'success': true}"}, name: "Store Data Example"}) // Example response

    @httpGet("/store")
    async Store(@request() req: Request, @response() res: Response){
        ...
    }
}
```


### Syncing with Postman API
The [PostmanApi] service provides methods for handling requests to the Postman API to create / update items (e.g. Collections and Environments). In order to create an instance of the [PostmanApi] class, a [Postman API Key](https://go.postman.co/integrations/services/pm_pro_api) must be passed into the constructor.
Visit [Postman's API documentation] to get a better understanding of what is happening when using the [PostmanApi] class.
> If you need an API key, generate the key in your [Postman Integrations Dashboard](https://go.postman.co/integrations/services/pm_pro_api)

#### PostmanApi Example
The example below shows how to sync collections and create them using the git branch it was executed from. A similar method can be used for environment variables.
```ts
...
IEPostman.ContainerToCollection(container, {name: collectionName}).then(async collection => {
    const pmAPI = new IEPostman.Services.PostmanApi("{{POSTMAN API KEY HERE}}");

    // Get the name of the current branch
    const gitPath = path.join(__dirname, "../../.git/HEAD");
    function parseBranch(buf: any) {
        const match = /ref: refs\/heads\/([^\n]+)/.exec(buf.toString());
        return match ? match[1] : null;
    }
    const collectionName = `MY API | ${parseBranch(fs.readFileSync(gitPath))}`;
    const collections = await pmAPI.ListCollections();

    // Maintain Creation and Updating based on matching collection names
    const matches = collections.collections.filter((value) => value.name === collectionName);
    if(matches.length <= 0)
    {
        pmAPI.CreateCollection(collection, "{{POSTMAN WORKSPACE ID}}").catch(error => console.error(`Failed to create collection`, error));
    }
    else
    {
        for(const match of matches)
        {
            pmAPI.UpdateCollection(collection, match.uid).catch(error => console.error(`Failed to update collection`, error));
        }
    }


}).catch(console.error);

```




### Adding Test Scripts
Test scripts are supported and can be associated with an endpoint by using the [PostmanTestFunction] decorators.

In this example, an endpoint has a prerequest and a test function.
##### Prequest and Test Example
```ts
import * as IEPostman from 'inversify-express-postman';

@controller("/api/v1/example", LOGGER_TYPES.LoggerMiddleWare)
export class ExampleAPIv1Controller extends ControllerBase {

    static PREREQUEST_store()
    {
        const json = JSON.stringify({
            pre: "request",
            obj: "example"
        });

        pm.variables.set("PreRequestBody");
    }

    ...

    @httpGet("/store")

    // Write the function in line
    @IEPostman.Decorators.PostmanTestFunction("test", (pm: any, responseBody: any) => {

        var response = JSON.parse(responseBody)
        pm.test("Success?", function () {pm.expect(response.success).to.equal(true)} );
    })

    // Pass in the function object
    @IEPostman.Decorators.PostmanTestFunction("prerequest", ExampleAPIv1Controller.PREREQUEST_store)
    async Store(@request() req: Request, @response() res: Response){
        ...
    }
}
```
When using a class `static` method for a test function, the name of the function should start with either `PREREQUEST` or `TEST` or `function`. See the [functionStripper](src\utils\functionStripper.ts) util to see how the stripper is working.



##### Support UTF-8 Encoded Test Scripts
###### This is still an in progress feature.
The [PostmanTestFunction] decorators support the use of absolute paths to files. This can be a remote resource and will be acquired using the [request-promise] package. Local resources are read using [fs].

[PostmanTestFunction]: ./src/decorators/PostmanTest.ts

[fs]: https://nodejs.org/api/fs.html
[request-promise]: https://www.npmjs.com/package/request-promise
[inversify-express-utils]: https://www.npmjs.com/package/inversify-express-utils
[Postman Collection]:https://www.npmjs.com/package/postman-collection
[Postman Collection Schema]: https://schema.getpostman.com/
[Postman's API documentation]: https://documenter.getpostman.com/view/631643/JsLs/?version=latest#intro
[Postman API]: https://documenter.getpostman.com/view/631643/JsLs/?version=latest#intro

[PostmanApi]: ./src/services/PostmanApi/PostmanApi.ts
