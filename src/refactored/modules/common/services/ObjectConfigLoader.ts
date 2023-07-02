import {ConfigLoader} from "./interfaces";

export class ObjectConfigLoader implements ConfigLoader {
    private readonly configObj: Record<string, any>;

    constructor(config: Record<string, any>) {
        this.configObj = config;
    }

    load(name?: string): Promise<Record<string, any>> {
        return Promise.resolve(this.configObj);
    }

}