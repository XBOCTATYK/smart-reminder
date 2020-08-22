import Model, { Sequelize } from 'sequelize';

export type OrmModelCollection = {
    [x: string]: Model.Sequelize;
}

type OrmModelList = Array<{
    key: Symbol | string;
    init: (ormInstance: Sequelize, models: OrmModelCollection, key: Symbol | string) => Model.Sequelize;
}>

export class ORMConnection {
    private models = {};
    private modelsList = [];

    constructor(connect: string, models: OrmModelList) {
        const instance = new Sequelize(connect);

        models.forEach((model) => {
            const modelInstance = model.init(instance, this.models, model.key);
            const modelName = model.key;

            this.models[modelName] = modelInstance;
            this.modelsList.push(modelInstance);
        })
    }

    model(name) {
        return this.models[name];
    }

    list() {
        return Object.values(this.models);
    }
}
