import { GeneratedId } from '../decorators/generated-id';
import { NumberType } from '../decorators/validators/NumberType';
import { Required } from '../decorators/validators/Required';
import { UserDTO } from './UserDTO';
import { NotificationsDTO } from './NotificationsDTO';
import { DTO } from '../decorators/validators/DTO';

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
    notifications?: NotificationsDTO[];
    user?: UserDTO;
}

@GeneratedId
export class TaskDTO implements ITaskDTO {
    @Required id: string;
    @Required name: string;
    @Required date: string;
    @Required time: string;
    @NumberType @Required notificationsNeed: number;
    @NumberType @Required notificationsDone: number;
    @NumberType @Required type?: number;
    @NumberType @Required priority?: number;
    startDate?: Date;
    @DTO user?: UserDTO;
    notifications?: NotificationsDTO[];

    constructor(data: ITaskDTO) {
        this.setName(data?.name);
        this.setDate(data?.date);
        this.setTime(data?.time);
        this.setPriority(data?.priority);
        this.setNotificationsNeed(data?.notificationsNeed);
        this.setNotificationsDone(data?.notificationsDone);
        this.setType(data?.type);
        this.setStartDate(data?.startDate);
        this.setUser(data?.user);
    }

    setName(name?: string) {
        if (!name) return;

        if (name.length > 1000) {
            throw new Error('TOO_LONG_NAME')
        }

        this.name = name;
        return this;
    }

    setDate(date?: string) {
        if (!date) return;

        if (!date.match(/[\d]{1,2}.[\d]{2}.[\d]{4}/)) {
            throw new Error('WRONG_DATE_FORMAT')
        }

        this.date = date;
        return this;
    }

    setTime(time?: string) {
        if (!time.match(/[\d]{1,2}:[\d]{2}/)) {
            throw new Error('WRONG_TIME_FORMAT')
        }

        this.time = time;
        return this;
    }

    setPriority(amount?: number) {
        if (!amount) return;

        this.priority = amount;
        return this;
    }

    setNotificationsNeed(amount?: number) {
        if (!amount) return;

        this.notificationsNeed = amount;
        return this;
    }

    setNotificationsDone(amount?: number) {
        if (!amount) return;

        this.notificationsDone = amount;
    }

    setType(type?: number) {
        if (!type) return;

        this.type = type;
        return this;
    }

    setStartDate(date?: Date) {
        if (!date) {
            this.startDate = new Date();
        }

        this.startDate = date;
        return this;
    }

    addNotification(notification: NotificationsDTO) {
        if (!notification.isConsistence) {
            throw new Error('')
        }

        this.notifications.push(notification);
        return this;
    }

    setUser(user: UserDTO) {
        this.user = user;
        return this;
    }

    checkConsistence() {

    }
}
