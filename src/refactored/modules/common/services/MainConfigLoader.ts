import {ConfigLoader} from "./interfaces";
import {merge} from "lodash";

export class MainConfigLoader implements ConfigLoader {
    private loaders: Set<ConfigLoader>;

    constructor(loaders: Set<ConfigLoader>) {
        this.loaders = loaders
    }

    async load() {
        return Promise.all([
            ...Array.from(this.loaders.values()).map(i => i.load())
        ]).then(configs =>
            configs.reduce((acc, config) => merge(acc, config), {})
        )
    }
}