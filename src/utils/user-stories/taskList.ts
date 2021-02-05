import { taskListMenu } from 'Src/messages/taskListMenu';

export async function showTaskList(taskList): Promise<[string, any]> {
    try {

        return [
            taskList.reduce((string, item) => {
            string += `${item.date} | ${item.time} | ${item.name} \n`;
            return string;
        }, ''),
            taskListMenu(taskList)
        ];

    } catch (e) {
        return null;
    }
}
