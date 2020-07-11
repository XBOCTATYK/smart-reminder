import { Sequelize } from 'sequelize';

export class ORMConnection {
    private models = {};
    private modelsList = [];

    constructor(connect: string, models) {
        const instance = new Sequelize(connect);

        models.forEach((model) => {
            const modelInstance = model(instance, this.models);
            const modelName = modelInstance.name;

            this.models[modelName] = modelInstance;
            this.modelsList.push(modelInstance);
        })
    }

    model(name) {
        return this.models[name];
    }

    list() {
        return this.modelsList;
    }
}
