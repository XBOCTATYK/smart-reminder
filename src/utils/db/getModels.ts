import { ORMConnection } from '../../db/orm-connection';
import { getUserModel } from 'Models/User';
import { getTasksModel } from 'Models/Tasks';
import { getNotifiesModel } from 'Models/Notifies';
import { getUsualModel } from 'Models/Usual';
import { getParamsModel } from 'Models/Params';

export function getModels() {
    return new ORMConnection(process.env.DATABASE_URL, [
        getUserModel,
        getTasksModel,
        getNotifiesModel,
        getUsualModel,
        getParamsModel,
    ]);
}
