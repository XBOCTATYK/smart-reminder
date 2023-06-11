import {ConfigLoader} from "./interfaces";
import * as fs from "fs/promises"
import * as path from "path";
import {Decoder} from "../interfaces/Decoder";
import {Logger} from "pino"

export class FileConfigLoader implements ConfigLoader {
    private decoder: Decoder;
    private readonly name: string;
    private logger: Logger;

    constructor(decoder: Decoder, logger: Logger, name: string) {
        this.decoder = decoder
        this.logger = logger
        this.name = name
    }

    async load(filename?: string): Promise<Record<string, any>> {
        const fileFullPath = path.resolve(process.cwd(), '/config', filename ?? this.name)

        return fs.readFile(fileFullPath, 'utf-8')
            .then(configFile => this.decoder.decode<Record<string, any>>(configFile))
            .then(res => {
                this.logger.info(`Successfully got config ${this.name}`);
                return res
            })
            .catch(err => this.logger.error(`Cannot get config ${this.name}. This requested config won't be merged!`, err))
            .then(res => typeof res === "undefined" ? ({}) : res)
    }
}