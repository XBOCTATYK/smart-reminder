import { GeneratedId } from '../decorators/generated-id';

interface ITaskDTO {
    id: string;
    name: string;
    date: string;
    time: string;
    notificationsNeed: number;
    notificationsDone: number;
    type?: number;
    priority?: number;
    startDate?: Date;
}

@GeneratedId
export class TaskDTO implements ITaskDTO {
    id: string;
    name: string;
    date: string;
    time: string;
    notificationsNeed: number;
    notificationsDone: number;
    type?: number;
    priority?: number;
    startDate?: Date;

    constructor(data: ITaskDTO) {
        this.setName(data.name);
        this.setDate(data.date);
        this.setTime(data.time);
        this.setPriority(data.priority);
        this.setNotificationsNeed(data.notificationsNeed);
        this.setNotificationsDone(data.notificationsDone);
        this.setType(data.type);
        this.setStartDate(data.startDate);
    }

    setName(name?: string) {
        if (!name) return;

        if (name.length > 1000) {
            throw new Error('TOO_LONG_NAME')
        }

        this.name = name;
    }

    setDate(date?: string) {
        if (!date) return;

        if (!date.match(/[\d]{1,2}.[\d]{2}.[\d]{4}/)) {
            throw new Error('WRONG_DATE_FORMAT')
        }

        this.date = date;
    }

    setTime(time?: string) {
        if (!time.match(/[\d]{1,2}:[\d]{2}/)) {
            throw new Error('WRONG_TIME_FORMAT')
        }

        this.time = time;
    }

    setPriority(amount?: number) {
        if (!amount) return;

        if (isNaN(amount)) {
            throw new Error('WRONG_PRIORITY_DATA_FORMAT')
        }

        this.priority = amount;
    }

    setNotificationsNeed(amount?: number) {
        if (!amount) return;

        this.notificationsNeed = amount;
    }

    setNotificationsDone(amount?: number) {
        if (!amount) return;

        this.notificationsDone = amount;
    }

    setType(type?: number) {
        if (!type) return;

        this.type = type;
    }

    setStartDate(date?: Date) {
        if (!date) {
            this.startDate = new Date();
        }

        this.startDate = date;
    }
}
