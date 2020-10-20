import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { REMIND_ACTION } from 'Constants/callback-actions';

export async function notificationCallback(ctx, DB) {
    const message = ctx.update?.callback_query?.data;

    if (!message) return;

    const [action, notificationsNeed, notifyId, answer] = message.split('/');

    if (action !== REMIND_ACTION) return;

    if (!notificationsNeed || !notifyId || !answer) return ;

    const messageAnswers = {
        Y: 'Отлично!',
        N: 'ОК! Повторим напоминание чуть позже',
        D: 'Отлично! Больше не напоминаю.'
    };

    try {
        // @ts-ignore
        const notifyExists = await DB.model(NOTIFICATION_ENTITY_KEY).findOne({ where: { id: notifyId }, include: [ DB.model(TASK_ENTITY_KEY) ]});
        const { dataValues: notify } = notifyExists || {};

        if (notify.answer === 'O') {
            const task = notifyExists.Task.dataValues;

            switch (answer) {
                case 'Y':
                    break;
                case 'N':
                    await DB.model(TASK_ENTITY_KEY).update({ notificationsNeed: notificationsNeed + 1 }, { where: { id: task.id } });
                    break;
                case 'D':
                    await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: task.id } });
                    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { task_id: task.id, done: false } });
                    break;
                default:
                    console.log('Unrecognized answer');
                    return ;
            }

            await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: answer }, { where: { id: notifyId } });
            ctx.reply(messageAnswers[answer])
        } else {
            ctx.reply('Вы уже давали ответ на это напоминание!')
        }

    } catch (e) {
        ctx.reply('Что-то пошло не так');
        console.log(e);
    }
}
