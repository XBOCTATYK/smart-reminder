import Markup from 'telegraf/markup';

export function dateControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Сегодня', JSON.stringify({ answerId: 'TODAY' })),
        Markup.callbackButton('Завтра', JSON.stringify({ answerId: 'TOMORROW' })),
        Markup.callbackButton('Повторяющееся событие', JSON.stringify({ answerId: 'REPEAT' })),
    ])
        .extra()
}

export function repeatControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Ежедневно', JSON.stringify({ answerId: 'DAILY' })),
        Markup.callbackButton('Еженедельно', JSON.stringify({ answerId: 'WEEKLY' })),
    ])
        .extra()
}

export function priorityControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('2', JSON.stringify({ answerId: '2' })),
        Markup.callbackButton('4', JSON.stringify({ answerId: '4' })),
        Markup.callbackButton('6', JSON.stringify({ answerId: '6' })),
        Markup.callbackButton('8', JSON.stringify({ answerId: '8' })),
        Markup.callbackButton('10', JSON.stringify({ answerId: '10' })),
    ])
        .extra()
}
