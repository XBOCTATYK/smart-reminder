import { NOTIFICATION_ENTITY_KEY } from 'Constants/enitityNames';

export async function updateNotifies(DB, thisDate, thisTime, task) {
    await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: 'C' }, { where: { done: true, task_id: task.id, answer: 'O' } })
    await DB.model(NOTIFICATION_ENTITY_KEY).update({ done: true }, { where: { time: thisTime, date: thisDate } })
}
