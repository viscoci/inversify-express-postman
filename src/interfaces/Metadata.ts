import { interfaces } from 'inversify-express-utils';
export interface Metadata {
    controllerMetadata: interfaces.ControllerMetadata;
    methodMetadata: interfaces.ControllerMethodMetadata[];
    parameterMetadata: interfaces.ControllerParameterMetadata;
  }
