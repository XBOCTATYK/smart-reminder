import Markup from 'telegraf/markup';

export function dateControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Сегодня', JSON.stringify({ answerId: 'TODAY' })),
        Markup.callbackButton('Завтра', JSON.stringify({ answerId: 'TOMORROW' })),
    ])
        .extra()
}
