import { addDays, addHours, addMinutes, format, parse } from 'date-fns';
import { POSTPONE_TASK } from 'Constants/callback-actions';
import { NOTIFICATION_ENTITY_KEY, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { DATE_FNS_OPTIONS, FULL_FORMAT, TIME_FORMAT } from 'Constants/formats';
import { createNewTask } from 'Utils/createNewTask';
import { getDateNow } from 'Utils/dates';
import { UserStateService } from 'Services/User';
import { STATES } from 'Constants/states';

export async function postponeTaskCallback(ctx, DB, logger) {
    const userId = ctx.update?.callback_query?.from?.id;
    const answer = ctx.update?.callback_query?.data;

    if (!answer) return;

    const [ action, taskId, taskAction ] = answer.split('/');

    if (action !== POSTPONE_TASK) return;

    const [amount, quantitificator] = taskAction.split('.');

    const taskDB = await DB.model(TASK_ENTITY_KEY).findOne({ where: { id: taskId } });
    const { dataValues: task } = taskDB || {};

    if (!task) {
        ctx.reply('Данной задачи уже не существует!');
    }

    let nextDateTime = parse(`${task.date} ${task.time}`, FULL_FORMAT, new Date(), DATE_FNS_OPTIONS);

    switch (quantitificator) {
        case 'М':
            nextDateTime = addMinutes(nextDateTime, amount)
            break;
        case 'H':
            nextDateTime = addHours(nextDateTime, amount)
            break;
        case 'D':
            nextDateTime = addDays(nextDateTime, amount)
            break;
        default:
            break;
    }

    const nextDateTimeFormatted = format(nextDateTime, FULL_FORMAT, DATE_FNS_OPTIONS);

    if (nextDateTimeFormatted) {
        try {

            logger.info('Перенос задачи %s', taskId);

            const [ nextDateFormatted, nextTimeFormatted ] = nextDateTimeFormatted.split(' ');

            await DB.model(NOTIFICATION_ENTITY_KEY).update({ done: true, answer: 'R' }, { where: { task_id: taskId } });
            await DB.model(TASK_ENTITY_KEY).update({ done: true }, { where: { id: taskId } });

            await createNewTask(DB, {
                date: nextDateFormatted,
                time: nextTimeFormatted,
                priority: task.priority,
                user_id: userId,
                name: task.name,
                done: false,
                notificationsDone: 0,
                startTime: format(new Date(), TIME_FORMAT, DATE_FNS_OPTIONS),
                startDate: getDateNow(),
            })

            await ctx.replyWithMarkdown(`Задача отложена!  Новое время задачи - ${nextTimeFormatted} | ${nextDateFormatted}  `)
        } catch (e) {
            logger.error('Ошибка при переносе задачи! %o', e)
        }
    }

    UserStateService(userId).setState(STATES.PENDING_TASK);
}
