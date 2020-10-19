import { Markup } from 'telegraf';

export function taskListMenu(tasks) {
    return Markup.inlineKeyboard(
        [tasks.map( (task, index) => {
            return Markup.callbackButton(index + 1, task.id)
        })]
    ).extra()
}
