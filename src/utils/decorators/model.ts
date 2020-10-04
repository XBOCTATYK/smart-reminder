import { getModels } from '../db/getModels';
import { ModelKey } from 'Constants/enitityNames';

const DB = getModels();

export function model(modelName: ModelKey) {
    return function (target: any, propertyKey: string): any {
        target[propertyKey] = DB.model(modelName);
    }
}
