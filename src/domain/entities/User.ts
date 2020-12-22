import { Task } from './Task';
import { Notification } from './Notification';
import { BusinessError } from '../errors';
import { ExtendedDate } from 'Utils/date-services/extended-date';

export class User {
    id: number;
    tasks: Task[];
    startTime: Date;
    endTime: Date;

    constructor(userData) {
        const { id, startTime, endTime } = userData;

        if (!id) {
            throw new BusinessError('NO_USER_IDENTIFIER')
        }

        this.startTime = startTime;
        this.endTime = endTime;
    }

    addTask(taskData: Task) {
        taskData.setUser(this).planNextNotification();
        return this;
    }

    isReadyToBeNotified(notification: Notification) {
        const notificationDate = ExtendedDate.of(notification.time)
    }

    isBanned: boolean;
}
