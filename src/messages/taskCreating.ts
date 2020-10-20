import Markup from 'telegraf/markup';
import { TASK_CREATING_ACTION } from 'Constants/callback-actions';

const templateMessage = `${TASK_CREATING_ACTION}`;

export function dateControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Сегодня', `${templateMessage}/TODAY`),
        Markup.callbackButton('Завтра', `${templateMessage}/TOMORROW`),
        Markup.callbackButton('Повторяющееся событие', `${templateMessage}/REPEAT`),
    ])
        .extra()
}

export function repeatControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('Ежедневно', `${templateMessage}/DAILY`),
        Markup.callbackButton('Еженедельно', `${templateMessage}/WEEKLY`),
    ])
        .extra()
}

export function priorityControls() {
    return Markup.inlineKeyboard([
        Markup.callbackButton('2', `${templateMessage}/2`),
        Markup.callbackButton('4', `${templateMessage}/4`),
        Markup.callbackButton('6', `${templateMessage}/6`),
        Markup.callbackButton('8', `${templateMessage}/8`),
        Markup.callbackButton('10', `${templateMessage}/10`),
    ])
        .extra()
}
