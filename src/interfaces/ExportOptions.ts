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