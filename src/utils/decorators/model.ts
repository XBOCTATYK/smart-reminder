import { getModels } from '../db/getModels';

const DB = getModels();

export function model(modelName: string) {
    return function (target: any, propertyKey: string): any {
        target[propertyKey] = DB.model(modelName);
    }
}
