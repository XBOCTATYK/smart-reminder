import { v1 } from 'uuid';
import { DONE_NOTIFIES_KEY, NOTIFICATION_ENTITY_KEY } from 'Constants/enitityNames';
import { ORMConnection } from 'Src/db/orm-connection';

export async function relocateDoneNotifies(DB: ORMConnection) {
    const doneNotifies = await DB.model(NOTIFICATION_ENTITY_KEY).findAll({ where: { done: true } });
    const doneNotifiesValues = doneNotifies.map(item => ({ ...item.dataValues, id: v1() }));

    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { done: true } });
    await DB.model(DONE_NOTIFIES_KEY).bulkCreate(doneNotifiesValues);
}
