import { v1 } from 'uuid';
import { NextNotification } from 'Services/Notification';
import { TASK_ENTITY_KEY, USUAL_EVENTS_ENTITY_KEY } from 'Constants/enitityNames';

export async function createNewTask(DB, options) {
    const currentOptions = { ...options, id: v1() };

    // пока так, пока не сделано вычисление оптимального количества уведомлений
    currentOptions.notificationsNeed = options.priority;

    try {
        const DBTaskResponse = await DB.model(TASK_ENTITY_KEY).create(currentOptions);
        const task = DBTaskResponse.dataValues;

        await NextNotification.create(task);

        if (options.usual) {
            const [ years, months, days, hours, minutes ] = options.usual;

            await DB.model(USUAL_EVENTS_ENTITY_KEY).create({
                id: v1(),
                task_id: task.id,
                days,
                hours,
                minutes,
                lastTaskDate: task.date,
                lastTaskTime: task.time,
            })
        }

        return task.id;
    } catch (e) {
        console.log(e);
        throw new Error(`Cannot create notify! ${e.message}`);
    }
}
