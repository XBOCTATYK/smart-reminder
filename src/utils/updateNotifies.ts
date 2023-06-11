import { NOTIFICATION_ENTITY_KEY } from 'Constants/enitityNames';
import { ANSWERS } from 'Constants/answers';

export async function updateNotifies(DB, thisDate, thisTime, task) {
    await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: ANSWERS.SKIP }, { where: { done: true, task_id: task.id, answer: ANSWERS.WAITING } })
    await DB.model(NOTIFICATION_ENTITY_KEY).update({ done: true }, { where: { time: thisTime, date: thisDate } })
}
