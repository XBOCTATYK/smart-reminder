import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { REMIND_ACTION } from 'Constants/callback-actions';
import { ANSWERS } from 'Constants/answers';

export async function notificationCallback(ctx, DB) {
    const message = ctx.update?.callback_query?.data;

    if (!message) return;

    const [action, notificationsNeed, notifyId, answer] = message.split('/');

    if (action !== REMIND_ACTION) return;

    if (!notificationsNeed || !notifyId || !answer) return ;

    const messageAnswers = {
        [ANSWERS.YES]: 'Отлично!',
        [ANSWERS.NO]: 'ОК! Повторим напоминание чуть позже',
        [ANSWERS.DONE]: 'Отлично! Больше не напоминаю.'
    };

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const notifyExists = await DB.model(NOTIFICATION_ENTITY_KEY).findOne({ where: { id: notifyId }, include: [ DB.model(TASK_ENTITY_KEY) ]});
        const { dataValues: notify } = notifyExists || {};

        if (notify.answer === ANSWERS.WAITING) {
            const task = notifyExists.Task.dataValues;

            switch (answer) {
                case ANSWERS.YES:
                    break;
                case ANSWERS.NO:
                    await DB.model(TASK_ENTITY_KEY).update({ notificationsNeed: notificationsNeed + 1 }, { where: { id: task.id } });
                    break;
                case ANSWERS.DONE:
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
