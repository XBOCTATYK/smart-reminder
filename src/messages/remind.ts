import Markup from 'telegraf/markup';

export function remindControls(task, notify) {
    const messageData = {
        ned: task.notificationsNeed,
        nid: notify.id,
    };

    console.log(JSON.stringify({ ...messageData,  ans: 'Y' }))

        return Markup.inlineKeyboard([
            Markup.callbackButton('Я помню', JSON.stringify({ ...messageData,  ans: 'Y' })),
            Markup.callbackButton('Я забыл', JSON.stringify({ ...messageData, ans: 'N' })),
            Markup.callbackButton('Я сделал', JSON.stringify({ ...messageData,  ans: 'D' }))
        ])
            .extra()
}
