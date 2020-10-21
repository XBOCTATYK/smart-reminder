import { v1 } from 'uuid';
import { DONE_NOTIFIES_KEY, DONE_TASK_KEY, NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { ORMConnection } from 'Src/db/orm-connection';

export async function relocateDoneTasks(DB: ORMConnection) {
    const doneTasks = await DB.model(TASK_ENTITY_KEY).findAll({ where: { done: true } });
    const doneTasksValues = doneTasks.map( async (item) => {
            const originalTask = { ...item.dataValues };
            const task = { ...item.dataValues, id: v1() }

            const doneNotifies = await DB.model(NOTIFICATION_ENTITY_KEY).findAll({ where: { task_id: originalTask.id, done: true } });

            const notifiesToCreate = doneNotifies.map(  (item) => ({ ...item.dataValues, task_id: task.id, id: v1() }))

            await DB.model(DONE_NOTIFIES_KEY).bulkCreate(notifiesToCreate);
            await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { task_id: originalTask.id, done: true } });

            return task;
        }
    );

    await DB.model(TASK_ENTITY_KEY).destroy({ where: { done: true } })
    await DB.model(DONE_TASK_KEY).bulkCreate(doneTasksValues);
}
