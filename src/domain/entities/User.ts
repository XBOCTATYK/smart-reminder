import { Task } from './Task';

export class User {
    id: number;
    tasks: Task[];

    constructor() {

    }

    addTask(taskData: Task) {
        taskData.createNotification(this);
    }

}
