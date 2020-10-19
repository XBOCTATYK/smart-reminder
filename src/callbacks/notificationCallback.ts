import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';

export async function notificationCallback(ctx, DB) {
    const { ned, nid, ans } = JSON.parse(ctx.update?.callback_query?.data);

    if (!ned || !nid || !ans) return ;

    const messageAnswers = {
        Y: 'Отлично!',
        N: 'ОК! Повторим напоминание чуть позже',
        D: 'Отлично! Больше не напоминаю.'
    };

    try {
        // @ts-ignore
        const notifyExists = await DB.model(NOTIFICATION_ENTITY_KEY).findOne({ where: { id: nid }, include: [ DB.model(TASK_ENTITY_KEY) ]});
        const { dataValues: notify } = notifyExists || {};

        if (notify.answer === 'O') {
            const task = notifyExists.Task.dataValues;

            switch (ans) {
                case 'Y':
                    break;
                case 'N':
                    await DB.model(TASK_ENTITY_KEY).update({ notificationsNeed: ned + 1 }, { where: { id: task.id } });
                    break;
                case 'D':
                    await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: task.id } });
                    break;
                default:
                    console.log('Unrecognized answer');
                    return ;
            }

            await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: ans }, { where: { id: nid } });
            ctx.reply(messageAnswers[ans])
        } else {
            ctx.reply('Вы уже давали ответ на это напоминание!')
        }

    } catch (e) {
        ctx.reply('Что-то пошло не так');
        console.log(e);
    }
}
