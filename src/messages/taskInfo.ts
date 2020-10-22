import { Markup } from 'telegraf';
import { TASK_UNDER_ACTION } from '../constants/callback-actions';

export function taskInfoControls(taskId) {
    const templateMessage = `${ TASK_UNDER_ACTION }/${ taskId }`;
    return Markup.inlineKeyboard([
        [
            Markup.callbackButton('Удалить', `${ templateMessage }/DEL`),
            Markup.callbackButton('Отложить следующее уведомление', `${ templateMessage }/RELOCATE`)
        ],
        [ Markup.callbackButton('Отложить задачу', `${ templateMessage }/POSTPONE`) ]
    ]).extra()
}
