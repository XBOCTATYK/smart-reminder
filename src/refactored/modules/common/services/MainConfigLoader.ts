import {ConfigLoader} from "./interfaces";
import merge from "lodash/merge";

export class MainConfigLoader implements ConfigLoader {
    private loaders: Set<ConfigLoader>;

    constructor(loaders: Set<ConfigLoader>) {
        this.loaders = loaders
    }

    async load(): Promise<Record<string, any>> {
        return Promise.all([
            ...Array.from(this.loaders.values()).map(i => i.load())
        ]).then(configs =>
            configs.reduce((acc, config) => merge(acc, config), {})
        )
    }
}