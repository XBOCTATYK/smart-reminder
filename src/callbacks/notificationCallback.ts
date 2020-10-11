import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';

export async function notificationCallback(ctx, DB) {
    const userId = ctx.update?.callback_query?.from?.id;
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

        if (notifyExists) {
            const task = notifyExists.Task.dataValues;

            switch (ans) {
                case 'Y':
                    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { id: nid } });
                    break;
                case 'N':
                    await DB.model(TASK_ENTITY_KEY).update({ notificationsNeed: ned + 1 }, { where: { id: task.id } });
                    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { id: nid } });
                    break;
                case 'D':
                    await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: task.id } });
                    await DB.model(NOTIFICATION_ENTITY_KEY).destroy({ where: { id: nid } });
                    break;
                default:
                    console.log('Unrecognized answer');
                    return ;
            }

            ctx.reply(messageAnswers[ans])
        } else {
            ctx.reply('Вы уже давали ответ на это напоминание!')
        }

    } catch (e) {
        ctx.reply('Что-то пошло не так');
        console.log(e);
    }
}
