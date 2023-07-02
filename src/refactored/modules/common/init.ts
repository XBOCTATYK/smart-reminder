import {ModuleExports, PetModule} from "../interfaces/PetModule";
import {DataSourceConfig, DBConfigLoader} from "./services/DBConfigLoader";
import {Channel} from "./interfaces/Channel";
import {Action} from "./interfaces/Action";
import {Logger} from "pino";
import {EntitiyMangerSequlize} from "./datasource/db/EntitiyMangerSequlize";
import {getParamsModel} from "../../../models/Params";
import {USER_PARAMS_ENTITY_KEY} from "../../../constants/enitityNames";

export type CommonModuleConfig = DataSourceConfig

export const COMMON_MODULE_SERVICES = {
    DB_CONFIG_LOADER: 'DB_CONFIG_LOADER'
}

export class CommonModule implements PetModule {
    private readonly config: CommonModuleConfig;
    private services: Record<string, any> = {};
    private channels: Record<string, Channel> = {};
    private actionTypes: Action<Record<string, any>>[] = [];
    private readonly logger: Logger;

    constructor(config: CommonModuleConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    init(): PetModule {
        const entityManager = new EntitiyMangerSequlize(this.config)
        entityManager.addEntity({ init: getParamsModel, key: USER_PARAMS_ENTITY_KEY })

        this.services = {
            [COMMON_MODULE_SERVICES.DB_CONFIG_LOADER]: new DBConfigLoader(this.logger, this.config, entityManager)
        }

        return this;
    }

    export(): ModuleExports {
        return {
            services: this.services,
            channels: this.channels,
            actionTypes: this.actionTypes
        };
    }

}