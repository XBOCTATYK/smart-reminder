import { ORMConnection } from './db/orm-connection';
import { getUserModel } from './models/User';
import { getTasksModel } from './models/Tasks';
import { getNotifiesModel } from './models/Notifies';
import { getUsualModel } from './models/Usual';

const userDefaults = {
    id: 0,
    time_from: '09:00',
    time_to: '22:00'
}

const tasksDefaults = {
    user_id: 0,
    name: 'Что-то за задача',
    time: '23:50',
    date: '12.07.2020',
    priority: 5,
}

const DB = new ORMConnection(process.env.DATABASE_URL, [
    getUserModel,
    getTasksModel,
    getNotifiesModel,
    getUsualModel,
])

setTimeout(async () => {
    const UserModel = await DB.model('User').sync({force: true});
    await UserModel.create(userDefaults)

    const TasksModel = await DB.model('Tasks').sync({force: true});
    await TasksModel.create(tasksDefaults);
    const NotifiesModel = await DB.model('Notifies').sync({force: true});
    const UsualModel = await DB.model('Usual').sync({force: true});
}, 10)

