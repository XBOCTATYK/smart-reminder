import { TASK_UNDER_ACTION } from '../constants/callback-actions';
import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from '../constants/enitityNames';

export async function taskUnderAction(ctx, DB) {
    const answer = ctx.update?.callback_query?.data;

    if (!answer) return;

    const [ action, taskId, taskAction ] = answer.split('/');

    if (action !== TASK_UNDER_ACTION) return;

    switch (taskAction) {
        case 'DEL': {
            await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: taskId } });
            ctx.reply('Задача удалена!')
            break;
        }

        case 'RELOCATE': {
            await DB.model(NOTIFICATION_ENTITY_KEY).update({ answer: 'X' }, { where: { task_id: taskId } });
            ctx.reply('Следующее напоминание будет пропущено!')
            break;
        }

        default: {
            break;
        }
    }
}
