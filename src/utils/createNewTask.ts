import { NextNotification } from 'Services/Notification';

export async function createNewTask(DB, options) {
    const currentOptions = { ...options };

    // пока так, пока не сделано вычисление оптимального количества уведомлений
    currentOptions.notificationsNeed = options.priority;

    try {
        const DBTaskResponse = await DB.model('Task').create(currentOptions);
        const task = DBTaskResponse.dataValues;

        await NextNotification.create(task);
    } catch (e) {
        console.log(e);
        throw new Error(`Cannot create notify! ${e.message}`);
    }
}
