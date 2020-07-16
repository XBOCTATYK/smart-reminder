import { getNextNotifyTime } from 'Src/utils/calculateTime';

export async function createNewTask(DB, options) {
    const currentOptions = { ...options };

    // пока так, пока не сделано вычисление оптимального количества уведомлений
    currentOptions.notificationsNeed = options.priority;

    try {
        const DBTaskResponse = await DB.model('Tasks').create(currentOptions);
        const task = DBTaskResponse.dataValues;
        const id = options.user_id;

        const DBUserResponse = await DB.model('User').findOne({ where: { id } });
        const user = DBUserResponse.dataValues;

        const nextNotify = getNextNotifyTime(user, task);

        await DB.model('Notifies').create({ task_id: task.id, date: nextNotify.date, time: nextNotify.time });
    } catch (e) {
        console.log(e);
        throw new Error(`Cannot create notify! ${e.message}`);
    }
}
