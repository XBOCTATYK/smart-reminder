import { Markup } from 'telegraf';
import { TASK_SELECT_ACTION } from 'Constants/callback-actions';

export function taskListMenu(tasks) {
    return Markup.inlineKeyboard(
        [tasks.map( (task, index) => {
            return Markup.callbackButton(index + 1, `${TASK_SELECT_ACTION}/${task.id}`)
        })]
    ).extra()
}
