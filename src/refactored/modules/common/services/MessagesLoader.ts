import {ResourceLoader} from "./interfaces";
import {MessagesConfig} from "../configs/MessagesConfig";

export class MessagesLoader implements ResourceLoader {
    private config: MessagesConfig;
    private baseResourceLoader: ResourceLoader;

    constructor(config: MessagesConfig, baseResourceLoader: ResourceLoader) {
        this.config = config
        this.baseResourceLoader = baseResourceLoader
    }

    async load() {
        return await this.baseResourceLoader.load(this.config.basePath)
    }
}