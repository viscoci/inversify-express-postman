# inversify-express-postman

[![NPM](https://nodei.co/npm/inversify-express-postman.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-express-postman/)

###### Package is not finished yet and breaking changes are likely  until v**1.0.0** is released.

Export [inversify-express-utils] metadata to a [Postman Collection].

###### [Postman Collection Schema]




### Getting Started

Once a container has been setup, use one of the top level functions to convert the metadata from the container's express endpoints to a Postman Collection or a JSON of the Collection.

In this example, a container is passed in and a JSON string is returned and logged to the console.
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

#### Manually Add Information
The [PostmanData](./src/decorators/PostmanData.ts) decorator allows the entry of some more Postman Collection supported items.


### Adding Test Scripts
Test scripts are supported and can be associated with an endpoint by using the [PostmanTestFunction] decorators.

In this example, an endpoint has a prerequest and a test function.
```ts
import * as IEPostman from 'inversify-express-postman';

@controller("/api/v1/example", LOGGER_TYPES.LoggerMiddleWare)
export class ExampleAPIv1Controller extends ControllerBase {

    PreRequest()
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
    @IEPostman.Decorators.PostmanTestFunction("prerequest", this.PreRequest)
    async Store(@request() req: Request, @response() res: Response){
        ...
    }
}
```

##### Support UTF-8 Encoded Test Scripts
###### This is still an in progress feature.
The [PostmanTestFunction] decorators support the use of absolute paths to files. This can be a remote resource and will be acquired using the [request-promise] package. Local resources are read using [fs].

[PostmanTestFunction]: ./src/decorators/PostmanTest.ts

[fs]: https://nodejs.org/api/fs.html
[request-promise]: https://www.npmjs.com/package/request-promise
[inversify-express-utils]: https://www.npmjs.com/package/inversify-express-utils
[Postman Collection]:https://www.npmjs.com/package/postman-collection
[Postman Collection Schema]: https://schema.getpostman.com/