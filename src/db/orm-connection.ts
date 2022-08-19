import { Sequelize, Model } from 'sequelize';
import { ModelKey } from 'Constants/enitityNames';

export type OrmModelCollection = {
    [key in ModelKey]?: typeof Model;
}

type OrmModelList = Array<{
    key: ModelKey;
    init: (ormInstance: Sequelize, models?: OrmModelCollection, key?: ModelKey) => typeof Model;
}>

export class ORMConnection {
    private models = {};
    private modelsList = [];

    constructor(connect: string, models: OrmModelList) {
        const instance = new Sequelize(connect, {
            timezone: '+03:00',
            retry: {
                max: 5,
            },
            pool: {
                max: 10,
                min: 1,
                acquire: 10000,
                idle: 30000
            }
        });

        models.forEach((model) => {
            const modelInstance = model.init(instance, this.models, model.key);
            const modelName = model.key;

            this.models[modelName] = modelInstance;
            this.modelsList.push(modelInstance);
        })
    }

    model(name: ModelKey) {
        return this.models[name];
    }

    list() {
        return Object.values(this.models);
    }
}
