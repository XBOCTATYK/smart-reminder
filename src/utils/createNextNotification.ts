import { getNextNotifyTime } from './calculateTime';

export async function createNextNotification(DB, task) {
    try {
        const id = task.id;
        await DB.model('Tasks').update({ ...task, notificationsDone: task.notificationsDone + 1 }, { where: { id } })

        const DBUserResponse = await DB.model('User').findOne({ where: { id: task.user_id } });
        const user = DBUserResponse.dataValues;
        const nextNotify = getNextNotifyTime(user, task);

        await DB.model('Notifies').create({ task_id: task.id, date: nextNotify.date, time: nextNotify.time });
    }   catch (e) {
        console.log(e);
        throw new Error(`Cannot create notify! ${e.message}`);
    }
}
