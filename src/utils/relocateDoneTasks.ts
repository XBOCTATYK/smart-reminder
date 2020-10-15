import { DONE_TASK_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { ORMConnection } from 'Src/db/orm-connection';

export async function relocateDoneTasks(DB: ORMConnection) {
    const doneTasks = await DB.model(TASK_ENTITY_KEY).findAll({ where: { done: true } });
    const doneTasksValues = doneTasks.map(item => item.dataValues);

    await DB.model(DONE_TASK_KEY).bulkCreate(doneTasksValues);
}
