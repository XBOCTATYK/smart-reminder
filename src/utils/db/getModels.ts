import { ORMConnection } from '../../db/orm-connection';
import { getUserModel } from 'Models/User';
import { getTasksModel } from 'Models/Tasks';
import { getNotifiesModel } from 'Models/Notifies';
import { getUsualModel } from 'Models/Usual';
import { getParamsModel } from 'Models/Params';
import {
    DONE_NOTIFIES_KEY,
    DONE_TASK_KEY,
    NOTIFICATION_ENTITY_KEY,
    TASK_ENTITY_KEY,
    USER_ENTITY_KEY,
    USER_PARAMS_ENTITY_KEY,
    USUAL_EVENTS_ENTITY_KEY
} from 'Constants/enitityNames';

export function getModels() {
    return new ORMConnection(process.env.DATABASE_URL, [
        { init: getUserModel, key: USER_ENTITY_KEY },
        { init: getTasksModel, key: TASK_ENTITY_KEY },
        { init: getNotifiesModel, key: NOTIFICATION_ENTITY_KEY },
        { init: getParamsModel, key: USER_PARAMS_ENTITY_KEY },
        { init: getUsualModel, key: USUAL_EVENTS_ENTITY_KEY },
        { init: getTasksModel, key: DONE_TASK_KEY },
        { init: getNotifiesModel, key: DONE_NOTIFIES_KEY },
    ]);
}
