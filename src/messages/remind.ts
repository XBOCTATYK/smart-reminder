import Markup from 'telegraf/markup';
import { REMIND_ACTION } from 'Constants/callback-actions';

export function remindControls(task, notify) {
    const message = `${REMIND_ACTION}/${task.notificationsNeed}/${notify.id}`

   return Markup.inlineKeyboard([
       Markup.callbackButton('Я помню', `${message}/Y`),
       Markup.callbackButton('Я забыл', `${message}/N`),
       Markup.callbackButton('Я сделал', `${message}/D`)
   ])
       .extra()
}
