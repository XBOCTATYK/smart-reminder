import { ORMConnection } from './db/orm-connection';
import { getUserModel } from './models/User';
import { getTasksModel } from './models/Tasks';
import { getNotifiesModel } from './models/Notifies';
import { getUsualModel } from './models/Usual';
import { getParamsModel } from './models/Params';
import { USER_ENTITY_KEY } from './constants/enitityNames';

const userDefaults = {
    id: 0,
    time_from: '09:00',
    time_to: '22:00'
};

const tasksDefaults = {
    user_id: 0,
    name: 'Что-то за задача',
    time: '23:50',
    date: '12.07.2020',
    startTime: '12:00',
    startDate: '11.07.2020',
    priority: 5,
};

const paramsDefault = [
    { key: 'TOKEN', value: '' },
    { key: 'DEFAULT_PRIORITY', value: 5 },
    { key: 'TIME_FORMAT', value: 'HH.mm' },
    { key: 'DATE_FORMAT', value: 'dd.MM.yyy' },
];

const DB = new ORMConnection(process.env.DATABASE_URL, [
    { init: getUserModel, key: USER_ENTITY_KEY },
    getTasksModel,
    getNotifiesModel,
    getParamsModel,
    getUsualModel,
]);

setTimeout(async () => {
    const UserModel = await DB.model('User').sync({force: true});
    await UserModel.create(userDefaults);

    const TasksModel = await DB.model('Tasks').sync({force: true});
    await TasksModel.create(tasksDefaults);
    const NotifiesModel = await DB.model('Notifies').sync({force: true});
    const ParamsModel = await DB.model('Params').sync({force: true});
    await paramsDefault.forEach(async (param) => {
        await ParamsModel.create(param);
    })
}, 10);

