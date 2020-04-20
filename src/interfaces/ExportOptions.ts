export type ExportOptions =
{
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