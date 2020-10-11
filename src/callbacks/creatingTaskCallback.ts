import { UserStateService } from 'Src/services/User';
import { STATES } from 'Constants/states';
import { getDateNow, getDateTomorrow } from 'Utils/dates';
import { dateControls, repeatControls } from 'Src/messages/taskCreating';

export function creatingTaskCallback(ctx) {
    const userId = ctx.update?.callback_query?.from?.id;
    const { answerId } = JSON.parse(ctx.update?.callback_query?.data);

    const User = UserStateService(userId);
    const currentState = User.state();

    console.log(currentState);
    switch (currentState) {
        case STATES.ENTER_TASK_DATE:
            switch (answerId) {
                case 'TODAY':
                    User.addData({ date: getDateNow() }).setState(STATES.ENTER_TASK_TIME);
                    ctx.reply('На какое время планируете?');
                    break;
                case 'TOMORROW':
                    User.addData( { date: getDateTomorrow() }).setState(STATES.ENTER_TASK_TIME);
                    ctx.reply('На какое время планируете?');
                    break;
                case 'REPEAT':
                    User.setState(STATES.REPEATING_TASK);
                    ctx.reply('Как часто выполняется задача?', repeatControls());
                    break;
                default:
                    return ;
            }
            break;
        case STATES.ENTER_TASK_PRIORITY:
            User.addData({ priority: Number(answerId) }).setState(STATES.ENTER_TASK_DATE);
            ctx.reply('На какую дату планируете?', dateControls());
            break;
        case STATES.REPEATING_TASK:
            switch (answerId) {
                case 'DAILY':
                    User.addData({ usual: [0,0,1,0,0] });
                    break;
                case 'WEEKLY':
                    User.addData({ usual: [0,0,7,0,0] })
                    break;
                default:
                    User.addData({ usual: [0,0,1,0,0] })
            }
            User.addData({ date: getDateNow() }).setState(STATES.ENTER_TASK_TIME);
        case STATES.CREATING_TASK_ERROR:
            break;
        default:
            return;
    }

    console.log(User.value())
}
