import { FileTypings, FileType } from ".";

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
    /**
     * Whether to automatically generate directories and files if they don't exist
     */
    autogenerate?: boolean;
    /**
     * Seperation character between the endpoint name and the file type
     * e.g.
     * @example
     * const seperator = ".";
     * var filename = "endpoint";
     * var filetype = "test";
     * var fileextension = "js";
     *
     * console.log(filename + sep + filetype + "." + fileextension) // endpoint.test.js
     */
    seperator?: string;

    /** File Naming Scheme. Used for associating documents to their purpose */
    filetypes?: FileTypings<FileType>;

    /**
     * Used to replace a value in a path. Useful if a doc path doesn't directly align with directory structure
     */
    replacements?: {[original: string]: string};

    /** Any paths that contain a request parameter will have the `:` replaced with this value. Default is `__` */
    reqparamreplace?: string;
}
