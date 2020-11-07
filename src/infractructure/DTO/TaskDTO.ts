interface ITaskDTO {
    id: number;
    name: string;
    date: string;
    time: string;
    notificationsNeed: number;
    notificationsDone: number;
    priority?: number;
    startDate?: Date;
}

export class TaskDTO implements ITaskDTO {
    id: number;
    name: string;
    date: string;
    time: string;
    notificationsNeed: number;
    notificationsDone: number;
    priority?: number;
    startDate?: Date;

    constructor(data: ITaskDTO) {

    }
}
