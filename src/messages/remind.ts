import Markup from 'telegraf/markup';

export function remindControls(task, notify) {
        return Markup.inlineKeyboard([
            Markup.callbackButton('Я помню', JSON.stringify({ task, notify, answerId: 'Y' })),
            Markup.callbackButton('Я забыл', JSON.stringify({ task, notify, answerId: 'N' })),
            Markup.callbackButton('Я сделал', JSON.stringify({ task, notify, answerId: 'D' }))
        ])
            .extra()
}
