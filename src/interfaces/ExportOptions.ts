import { ExternalMetadataHandler } from '../services/ExternalMetadata/index';

export type FileType = {id: string; ext: string};

export type FileTypings<T> = {
    tests?: T;
    pretests?: T;
    /** Response Example */
    examples?: T;
    description?: T;
    requestbody?: T;
}

export type ExternalMetadata =
{
    /**
     * Path to the directory where documenation data is stored
     */
    root: string;
    /**
     * Whether to override decorator data
     */
    override?: boolean;
    autogenerate?: boolean;
    seperator?: string;

    filetypes?: FileTypings<FileType>;

    /**
     * Used to replace a value in a path. Useful if a doc path doesn't directly align with directory structure
     */
    replacements?: {[original: string]: string};

    reqparamreplace?: string;
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