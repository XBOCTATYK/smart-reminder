import {ConfigLoader} from "./interfaces";
import {Logger} from "pino";
import {EntityManager} from "../interfaces/EntityManager";
import {USER_PARAMS_ENTITY_KEY} from "../datasource/constants/enitityNames";
import Model, {ModelType} from "sequelize";

export interface DataSourceConfig {
    timezone: string,
    db: {
        connect: string,
        pool: {
            min: number,
            max: number
        }
    }
}

export class DBConfigLoader implements ConfigLoader {
    private logger: Logger;
    private config: DataSourceConfig;
    private entityManager: EntityManager;

    constructor(logger: Logger, config: DataSourceConfig, entityManager: EntityManager) {
        this.logger = logger;
        this.config = config;
        this.entityManager = entityManager;
    }

    async load(name?: string): Promise<Record<string, any>> {
        const entity = this.entityManager.getEntity(USER_PARAMS_ENTITY_KEY) as ModelType
        const result = await entity.findAll()

        return result.map(i => i.get()).reduce((acc, item) => ({
            ...acc,
            [item.key]: item.value
        }), {}) as Record<string, any>
    }
}