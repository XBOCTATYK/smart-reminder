import { TaskListService } from '../../services/Task';
import { taskListMenu } from 'Src/messages/taskListMenu';

export async function showTaskList(userId, logger): Promise<[string, any]> {
    logger.info('List. UserID: %s', userId);

    try {
        const UserTaskList = await TaskListService.create(userId);

        return [
            UserTaskList.value().reduce((string, item) => {
            string += `${item.date} | ${item.time} | ${item.name} \n`;
            return string;
        }, ''),
            taskListMenu(UserTaskList.value())
        ];

    } catch (e) {
        logger.error('Cannot get tasklist! %o', e)
        return null;
    }
}
