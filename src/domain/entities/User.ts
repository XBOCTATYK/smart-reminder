import { Task } from './Task';

export class User {
    id: number;
    tasks: Task[];

    constructor() {

    }

    addTask(taskData) {
        const newTask = new Task(taskData);

    }

}
