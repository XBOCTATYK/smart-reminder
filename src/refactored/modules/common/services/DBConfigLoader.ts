import {ConfigLoader} from "./interfaces";
import {Logger} from "pino";

export class DBConfigLoader implements ConfigLoader {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    load(name?: string): Promise<Record<string, any>> {
        return Promise.resolve(undefined);
    }
}