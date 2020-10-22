import { TASK_UNDER_ACTION } from 'Constants/callback-actions';
import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { postponeControls } from 'Src/messages/postponeControls';
import { UserStateService } from 'Services/User';
import { STATES } from 'Constants/states';

export async function taskUnderAction(ctx, DB) {
    const userId = ctx.update?.callback_query?.from?.id;
    const answer = ctx.update?.callback_query?.data;

    if (!answer) return;

    const [ action, taskId, taskAction ] = answer.split('/');

    if (action !== TASK_UNDER_ACTION) return;

    switch (taskAction) {
        case 'DEL': {
            await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: taskId } });
            await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: 'K', done: true }, { where: { task_id: taskId } });
            ctx.reply('Задача удалена!')
            break;
        }

        case 'RELOCATE': {
            await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: 'X' }, { where: { task_id: taskId } });
            ctx.reply('Следующее напоминание будет пропущено!')
            break;
        }

        case 'POSTPONE': {
            UserStateService(userId).setState(STATES.POSTPONE_TASK);
            await ctx.reply('Насколько отложить?', postponeControls(taskId))
            break;
        }

        default: {
            break;
        }
    }
}
