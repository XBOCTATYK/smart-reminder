import { DONE_NOTIFIES_KEY, NOTIFICATION_ENTITY_KEY } from 'Constants/enitityNames';
import { ORMConnection } from 'Src/db/orm-connection';

export async function relocateDoneNotifies(DB: ORMConnection) {
    const doneNotifies = await DB.model(NOTIFICATION_ENTITY_KEY).findAll({ where: { done: true } });
    const doneNotifiesValues = doneNotifies.map(item => item.dataValues);

    await DB.model(DONE_NOTIFIES_KEY).bulkCreate(doneNotifiesValues);
    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { done: true } });
}
