import { Task } from './Task';
import { Notification } from './Notification';
import { BusinessError } from '../errors';
import { ExtendedDate } from 'Utils/date-services/extended-date';
import { BUSINESS_ERROR } from 'Constants/errors';

export class User {
    id: number;
    tasks: Task[];
    startTime: Date;
    endTime: Date;
    timezone: number;

    constructor(userData) {
        const { id, startTime, endTime, timezone } = userData;

        if (!id) {
            throw new BusinessError(BUSINESS_ERROR.NO_USER_IDENTIFIER);
        }

        if (timezone > 12 && timezone < -12) {
            throw new BusinessError(BUSINESS_ERROR.INCORRECT_TIMEZONE);
        }

        if (this.startTime.getTime() > this.endTime.getTime()) {
            throw new BusinessError(BUSINESS_ERROR.END_TIME_LESS_THAN_START);
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
