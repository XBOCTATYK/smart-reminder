export async function notificationCallback(ctx, DB) {
    const userId = ctx.update?.callback_query?.from?.id;
    const { taskId, notifNed, notifyId, answerId } = JSON.parse(ctx.update?.callback_query?.data);

    if (!taskId || !notifNed || !notifyId || !answerId) return ;

    const messageAnswers = {
        Y: 'Отлично!',
        N: 'ОК! Повторим напоминание чуть позже',
        D: 'Отлично! Больше не напоминаю.'
    };

    try {
        // @ts-ignore
        const notifyExists = await DB.model('Notifies').findOne({ where: { id: notifyId }});

        console.log(notifyExists);

        if (notifyExists) {
            switch (answerId) {
                case 'Y':
                    await DB.model('Notifies').destroy({ where: { id: notifyId } });
                    break;
                case 'N':
                    await DB.model('Tasks').update({ notificationsNeed: notifNed + 1 }, { where: { id: taskId } });
                    await DB.model('Notifies').destroy({ where: { id: notifyId } });
                    break;
                case 'D':
                    await DB.model('Tasks').update({ done: true }, { where: { id: taskId } });
                    await DB.model('Notifies').destroy({ where: { id: notifyId } });
                    break;
                default:
                    console.log('Unrecognized answer');
                    return ;
            }

            ctx.reply(messageAnswers[answerId])
        } else {
            ctx.reply('Вы уже давали ответ на это напоминание!')
        }

    } catch (e) {
        ctx.reply('Что-то пошло не так');
        console.log(e);
    }
}
