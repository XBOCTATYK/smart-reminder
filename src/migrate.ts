import format from 'date-fns/format';
import { v1 } from 'uuid';

import { ORMConnection } from './db/orm-connection';
import { getUserModel } from './models/User';
import { getTasksModel } from './models/Tasks';
import { getNotifiesModel } from './models/Notifies';
import { getUsualModel } from './models/Usual';
import { getParamsModel } from './models/Params';
import {
    NOTIFICATION_ENTITY_KEY,
    TASK_ENTITY_KEY,
    USER_ENTITY_KEY,
    USER_PARAMS_ENTITY_KEY, USUAL_EVENTS_ENTITY_KEY
} from './constants/enitityNames';
import { DATE_FNS_OPTIONS, DATE_FORMAT } from './constants/formats';

const userDefaults = {
    id: 0,
    time_from: '09:00',
    time_to: '22:00'
};


const paramsDefault = [
    { id: v1(), key: 'TOKEN', value: '' },
    { id: v1(), key: 'DEFAULT_PRIORITY', value: 5 },
    { id: v1(), key: 'TIME_FORMAT', value: 'HH.mm' },
    { id: v1(), key: 'DATE_FORMAT', value: 'dd.MM.yyy' },
];

const tasksDefaults = {
    id: v1(),
    user_id: 0,
    name: 'Что-то за задача',
    time: '23:50',
    date: format(new Date(), DATE_FORMAT, DATE_FNS_OPTIONS),
    startTime: '12:00',
    startDate: format(new Date(), DATE_FORMAT, DATE_FNS_OPTIONS),
    priority: 5,
};

const DB = new ORMConnection(process.env.DATABASE_URL, [
    { init: getUserModel, key: USER_ENTITY_KEY },
    { init: getTasksModel, key: TASK_ENTITY_KEY },
    { init: getNotifiesModel, key: NOTIFICATION_ENTITY_KEY },
    { init: getParamsModel, key: USER_PARAMS_ENTITY_KEY },
    { init: getUsualModel, key: USUAL_EVENTS_ENTITY_KEY }
]);

setTimeout(async () => {
    try {
        const UserModel = await DB.model(USER_ENTITY_KEY).sync({force: true});
        await UserModel.create(userDefaults);

        const TasksModel = await DB.model(TASK_ENTITY_KEY).sync({force: true});
        await TasksModel.create(tasksDefaults);
        const NotifiesModel = await DB.model(NOTIFICATION_ENTITY_KEY).sync({force: true});
        const ParamsModel = await DB.model(USER_PARAMS_ENTITY_KEY).sync({force: true});
        await paramsDefault.forEach(async (param) => {
            await ParamsModel.create(param);
        })
    } catch (e) {
        console.log(e);
    }
}, 10);

