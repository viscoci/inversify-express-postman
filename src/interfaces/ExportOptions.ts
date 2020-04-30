import { ExternalMetadataHandler } from '../services/ExternalMetadata/index';
import { ExternalMetadata } from './ExternalMetadata';

export type FileType = {
  /** A name for associating the file type */
  id: string;
  /** File extension without a period */
  ext: string;
  /** Location to start storing the files of this type */
  root: string;
  /**Whether to auto generate a blank file if it doesn't exist */
  autogen: boolean;
};

export type FileTypings<T> = {
    tests?: T;
    pretests?: T;
    /** Response Example */
    examples?: T;
    description?: T;
    requestbody?: T;
}


export type ExportOptions =
{

  /**
   * Options for managing route based documentation and endpoint information retrieval
   *
   * Used for auto generating files and paths of which can contain relevant data about an endpoint
   */
  extmeta?: ExternalMetadata;

  /**
   * The value or path hosting the endpoints.
   * @type {string} Treated as a variable `{{hostKey}}`
   * @type {string[]} Treated as a split host path. `https://${hostKey[0]}.${hostKey[1]}`
   */
  hostKey?: string | string[];

  /**
   * When specifying a host path, a protocol must also be specified
   */
  hostProtocol?: "http" | "https";


  /**
   * Sets the Collection Name. A random key is generated if none is provided
   */
  name?: string;

  /**
   * Unique Identifier to give the collection. Use this for when you want to update an already existing collection
   */
  uid?: string;
}