import { FileTypings, FileType } from '../../interfaces/ExportOptions';
import * as fs from 'fs';
import path = require('path');
import { textFromFile } from '../../utils';
import { CollectionHandler } from '../../index';
import { Metadata, PostmanEventTest, ExternalMetadata } from '../../interfaces';
import { ResponseDefinition } from '../../interfaces/DecoratorData';
import { interfaces } from 'inversify-express-utils';


export type FileTypes = keyof FileTypings<any>;

export class ExternalMetadataHandler
{
    static get DefaultFileTypes(): FileTypings<FileType> {
        return {
            requestbody: {id: "body", ext: "json", root: "", autogen: true},
            examples: {id: "example", ext: "json", root: "", autogen: true},
            description: {id: "", ext: "md", root: "", autogen: true},
            pretests: {id: "pre.test", ext: "js", root: "", autogen: true},
            tests: {id: "test", ext: "js", root: "", autogen: true}
        }
    }

    root: string;
    seperator: string;
    autogenerate: boolean;
    override: boolean;
    filetypes: FileTypings<FileType>;
    replacements: {[original: string]: string}
    reqparamreplace: string;

    constructor(extmeta: ExternalMetadata)
    {
        this.root = extmeta.root;
        this.seperator = extmeta.seperator || ".";
        this.autogenerate = extmeta.autogenerate || false;
        this.override = extmeta.override || false;
        this.replacements = extmeta.replacements || {};
        this.reqparamreplace = extmeta.reqparamreplace || "__";

        this.filetypes = ExternalMetadataHandler.DefaultFileTypes;

        for(const key in extmeta.filetypes)
        {
            if(extmeta.filetypes[key] != null)
            {
                this.filetypes[key] = extmeta.filetypes[key];
            }
        }
    }

    private FilePathBuilder(fileName: string, fileType: FileTypes): string
    {
        try {
            const split = fileName.split(/[\\/]/);

            // Handle replacements
            for(let i = 0; i < split.length; i++)
            {
                if(split[i].startsWith(":"))
                {
                    split[i] = split[i].replace(":", this.reqparamreplace);
                }

                if(this.replacements[split[i]] != null)
                {
                    split[i] = this.replacements[split[i]];
                }
            }

            const rootByType = path.join(this.root, this.filetypes[fileType].root);

            return path.join(rootByType, `${path.join(...split)}${this.filetypes[fileType].id.length > 0 ? this.seperator : ""}${this.filetypes[fileType].id}.${this.filetypes[fileType].ext}`);
        } catch (error) {
            console.error(`FAILED TO JOIN PATH USING VARIABLES`, {
                fileName,
                root: this.root,
                seperator: this.seperator,
                fileTypeObj: this.filetypes[fileType],
                fileType
            })

            throw new Error('FAILED IN FilePathBuilder');
        }
    }

    private PathsBuilder(subroute: string): FileTypings<string>
    {
        const paths = {};
        for(const key in this.filetypes)
        {
            paths[key] = (this.FilePathBuilder(subroute, <FileTypes>key));
            console.log(`paths[${key}]`, paths[key]);
        }

        return paths;
    }

    ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
          return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    /**
     * Handles path generation if necessary
     * @param subroute
     * @param isFolder
     */
    private ReadMetadata(subroute: string, isFolder: boolean): FileTypings<string>
    {
        const paths = this.PathsBuilder(subroute);

        for(const key in paths)
        {
            if(!fs.existsSync(paths[key]))
            {
                if(!this.autogenerate)
                {
                    continue;
                }

                if(!this.filetypes[key].autogen)
                {
                    continue;
                }


                if(isFolder)
                {
                    switch(<FileTypes>key)
                    {
                        case "tests":
                        case "pretests":
                        case "description":
                            console.log('File at path does not exist, generating...', paths[key]);
                            this.ensureDirectoryExistence(paths[key]);
                            fs.writeFileSync(paths[key], "");
                            break;
                    }
                }
                else
                {
                    console.log('File at path does not exist, generating...', paths[key]);
                    this.ensureDirectoryExistence(paths[key]);
                    fs.writeFileSync(paths[key], "");
                }
            }
        }

        return paths;
    }

    ProcessFolderMetaData(metadata: Metadata, decordata: CollectionHandler)
    {
        const tname = metadata.controllerMetadata.target.name;
        const basePath = metadata.controllerMetadata.path;

        const Files = this.ReadMetadata(basePath, true);

        if(!this.DecoratorDataCheck(decordata, tname))
        {
            return;
        }

        for(const key in Files)
        {
            switch(<FileTypes>key)
            {
                case "tests":
                {
                    if(decordata.folders[tname].folder.tests == null)
                    {
                        decordata.folders[tname].folder.tests = {};
                    }

                    if(decordata.folders[tname].folder.tests.paths == null)
                    {
                        decordata.folders[tname].folder.tests.paths = new Array<PostmanEventTest<string>>();
                    }

                    decordata.folders[tname].folder.tests.paths.push({listen: "test", func: Files[key]});
                    break;
                }

                case "pretests":
                {
                    if(decordata.folders[tname].folder.tests == null)
                    {
                        decordata.folders[tname].folder.tests = {};
                    }

                    if(decordata.folders[tname].folder.tests.paths == null)
                    {
                        decordata.folders[tname].folder.tests.paths = new Array<PostmanEventTest<string>>();
                    }

                    decordata.folders[tname].folder.tests.paths.push({listen: "prerequest", func: Files[key]});
                    break;
                }

                case "description":
                {
                    if(!this.override  && decordata.folders[tname].folder.description != null) {break;}

                    decordata.folders[tname].folder.description = {type: "path", value: Files[key]}
                    break;
                }

                case "requestbody":
                {
                    if(!this.override && decordata.folders[tname].folder.body != null) {break;}

                    decordata.folders[tname].folder.body =  {mode: "raw", raw: {value: Files[key], type: "path"}};
                    break;
                }

                case "examples":
                {

                    if(decordata.folders[tname].folder.responses == null)
                    {
                        decordata.folders[tname].folder.responses = new Array<string | ResponseDefinition>();
                    }

                    decordata.folders[tname].folder.responses.push(Files[key]);
                    break;
                }
            }
        }
    }

    ProcessEndpointMetaData(metadata: Metadata, decordata: CollectionHandler, endpoint: interfaces.ControllerMethodMetadata)
    {
        const tname = metadata.controllerMetadata.target.name;
        const basePath = metadata.controllerMetadata.path;

        // console.log(`basePath==${basePath}`);
        // console.log(`endpoint==${endpoint.path}`);
        const jointPath = path.join(basePath, endpoint.path);
        //console.log(`conjoine==${jointPath}`);
        const Files = this.ReadMetadata(jointPath, false);

        const eKey = endpoint.key;

        if(!this.DecoratorDataCheck(decordata, tname, eKey))
        {
            return;
        }

        for(const key in Files)
        {
            switch(<FileTypes>key)
            {
                case "tests":
                {
                    if(decordata.folders[tname].controllers[eKey].tests == null)
                    {
                        decordata.folders[tname].controllers[eKey].tests = {};
                    }

                    if(decordata.folders[tname].controllers[eKey].tests.paths == null)
                    {
                        decordata.folders[tname].controllers[eKey].tests.paths = new Array<PostmanEventTest<string>>();
                    }

                    decordata.folders[tname].controllers[eKey].tests.paths.push({listen: "test", func: Files[key]});
                    break;
                }

                case "pretests":
                {
                    if(decordata.folders[tname].controllers[eKey].tests == null)
                    {
                        decordata.folders[tname].controllers[eKey].tests = {};
                    }

                    if(decordata.folders[tname].controllers[eKey].tests.paths == null)
                    {
                        decordata.folders[tname].controllers[eKey].tests.paths = new Array<PostmanEventTest<string>>();
                    }

                    decordata.folders[tname].controllers[eKey].tests.paths.push({listen: "prerequest", func: Files[key]});
                    break;
                }

                case "description":
                {
                    if(!this.override  && decordata.folders[tname].controllers[eKey].description != null) {break;}

                    decordata.folders[tname].controllers[eKey].description = {type: "path", value: Files[key]}
                    break;
                }

                case "requestbody":
                {
                    if(!this.override && decordata.folders[tname].controllers[eKey].body != null) {break;}

                    decordata.folders[tname].controllers[eKey].body =  {mode: "raw", raw: {value: Files[key], type: "path"}};
                    break;
                }

                case "examples":
                {

                    if(decordata.folders[tname].controllers[eKey].responses == null)
                    {
                        decordata.folders[tname].controllers[eKey].responses = new Array<string | ResponseDefinition>();
                    }

                    decordata.folders[tname].controllers[eKey].responses.push(Files[key]);
                    break;
                }
            }
        }
    }

    /**
     * Returns false if the data checked will return undefined for any properties
     * @param decordata
     * @param folderName
     * @param endpointKey
     */
    private DecoratorDataCheck(decordata: CollectionHandler, folderName: string, endpointKey?: string)
    {
        if(decordata.folders[folderName] == null)
        {
            decordata.folders[folderName] = {folder: {}, controllers: {}}

            return false;
        }

        if(decordata.folders[folderName].folder == null)
        {
            return false;
        }

        if(endpointKey == null)
        {
            return true;
        }

        if(decordata.folders[folderName].controllers == null)
        {
            decordata.folders[folderName].controllers = {};
            return false;
        }

        if(decordata.folders[folderName].controllers[endpointKey] == null)
        {
            decordata.folders[folderName].controllers[endpointKey] = {}
            return false;
        }

        return true;
    }
}