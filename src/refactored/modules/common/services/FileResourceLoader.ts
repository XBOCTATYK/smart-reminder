import {Decoder} from "../interfaces/Decoder";
import {Configurable, ResourceLoader} from "./interfaces";
import * as fs from "fs/promises";
import * as path from "path";
import {cloneDeep, merge} from "lodash";
import {Dir} from "fs";

export class FileResourceLoader implements ResourceLoader, Configurable {
    private decoder: Decoder;
    private config: Record<string, string> = {
        basePath: ''
    }

    constructor(decoder: Decoder) {
        this.decoder = decoder
    }

    async load(filePath?: string) {
        return Promise.resolve(path.resolve(process.cwd(), this.config.basePath, filePath))
            .then(fileFullPath => fs.readFile(fileFullPath, 'utf-8'))
            .then(configFile => this.decoder.decode<Record<string, any>>(configFile))
    }

    async scanDir(dir: Dir) {
        dir.read()
            .then(res => this.load(res.name))
    }

    getConfig(): Record<string, any> {
        return cloneDeep(this.config)
    }

    configure(config: Record<string, any>): Configurable {
        this.config = merge(this.config, config)
        return this
    }
}