import { UserService } from 'Src/services/User';
import { STATES } from 'Constants/states';
import { getDateNow, getDateTomorrow } from 'Utils/dates';

export function creatingTaskCallback(ctx) {
    const userId = ctx.update?.callback_query?.from?.id;
    const { answerId } = JSON.parse(ctx.update?.callback_query?.data);

    const User = UserService(userId);
    const currentState = User.state();

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
                default:
                    return ;
            }
            break;
        case STATES.ENTER_TASK_PRIORITY:
            break;
        case STATES.CREATING_TASK_ERROR:
            break;
        default:
            return;
    }
}
