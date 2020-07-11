import Markup from 'telegraf/markup';

export function remindControls() {
        return Markup.inlineKeyboard([
            Markup.callbackButton('Я помню', 'Y'),
            Markup.callbackButton('Я забыл', 'N'),
            Markup.callbackButton('Я сделал', 'D')
        ])
            .extra()
}
