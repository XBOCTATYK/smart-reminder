import {EntityManager, OrmModelItem} from "../../interfaces/EntityManager";
import {ModelKey} from "../constants/enitityNames";
import {Model, Sequelize} from "sequelize";
import {DataSourceConfig} from "../../services/DBConfigLoader";

export type OrmModelCollection = {
    [key in ModelKey]?: typeof Model;
}

export class EntitiyMangerSequlize implements EntityManager {
    private models: Record<string, typeof Model> = {};
    private modelsList = [];
    private instance: Sequelize;

    constructor(config: DataSourceConfig, ) {
        this.instance = new Sequelize(
            config.db.connect,
            {
                timezone: config.timezone,
                retry: {
                    max: 5,
                },
                pool: {
                    max: config.db.pool.max,
                    min: config.db.pool.min,
                    acquire: 10000,
                    idle: 30000
                }
            });
    }

    addEntity(model: OrmModelItem): EntitiyMangerSequlize {
        const modelInstance = model.init(this.instance, this.models, model.key);
        const modelName = model.key;

        this.models[modelName] = modelInstance;
        this.modelsList.push(modelInstance);

        return this;
    }

    addEntities(models: OrmModelItem[]): EntitiyMangerSequlize {
        models.forEach(this.addEntity)

        return this;
    }

    getEntity<T extends typeof Model>(name: ModelKey): T {
        return this.models[name] as T;
    }

    list(): Array<typeof Model> {
        return Object.values(this.models);
    }
}