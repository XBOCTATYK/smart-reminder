import { Sequelize, Model } from 'sequelize';

import { ModelKey } from 'Constants/enitityNames';

import { Shape } from 'Types/shape';

export type OrmModelCollection = {
    [key in ModelKey]?: typeof Model;
}

type OrmModelList = Array<{
    key: ModelKey;
    init: (ormInstance: Sequelize, models?: OrmModelCollection, key?: ModelKey) => typeof Model;
}>

export class ORMConnection {
    private models: Shape<typeof Model> = {};
    private modelsList = [];

    constructor(connect: string, models: OrmModelList) {
        const instance = new Sequelize(connect, {
            timezone: '+03:00',
            retry: {
                max: 5,
            }
        });

        models.forEach((model) => {
            const modelInstance = model.init(instance, this.models, model.key);
            const modelName = model.key;

            this.models[modelName] = modelInstance;
            this.modelsList.push(modelInstance);
        })
    }

    model(name: ModelKey): any {
        return this.models[name];
    }

    list() {
        return Object.values(this.models);
    }
}
