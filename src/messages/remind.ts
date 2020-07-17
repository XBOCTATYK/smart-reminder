import Markup from 'telegraf/markup';

export function remindControls(task, notify) {
    console.log(JSON.stringify({ ...task, ...notify, answerId: 'Y' }))
    console.log({ ...task, ...notify, answerId: 'Y' })
    const messageData = {
        taskId: task.id,
        notifNed: task.notificationsNeed,
        notifyId: notify.id,
    }
        return Markup.inlineKeyboard([
            Markup.callbackButton('Я помню', JSON.stringify({ ...messageData,  answerId: 'Y' })),
            Markup.callbackButton('Я забыл', JSON.stringify({ ...messageData, answerId: 'N' })),
            Markup.callbackButton('Я сделал', JSON.stringify({ ...messageData,  answerId: 'D' }))
        ])
            .extra()
}
