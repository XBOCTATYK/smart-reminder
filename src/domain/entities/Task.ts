import { User } from 'Domain/entities/User';
import { Notification } from 'Domain/entities/Notification';
import { BusinessError } from 'Domain/errors';
import { BUSINESS_ERROR } from 'Constants/errors';
import { getNextNotifyTime } from 'Utils/calculateTime';

export class Task {
    user?: User;
    date: Date;
    nextNotification: Notification;
    notificationsNeed: number;
    notificationsDone: number;
    done: boolean;

    constructor(taskData: any) {
        if (taskData.priority <= 0) {
            throw new BusinessError(BUSINESS_ERROR.ZERO_PRIORITY)
        }

        if (taskData.priority > 20) {
            throw new BusinessError(BUSINESS_ERROR.TOO_HIGH_PRIORITY)
        }

        if (taskData.notificationsNeed <= taskData.notificationsDone) {
            this.setDone();
        }

        this.date = taskData.date;
    }

    private createNotification() {
        if (this.done) {
            throw new BusinessError(BUSINESS_ERROR.CANNOT_CREATE_NOTIFICATION_TASK_IS_DONE)
        }

        if (!this.user) {
            throw new BusinessError(BUSINESS_ERROR.USER_IS_NOT_DEFINED)
        }

        const nextNotifyDate = getNextNotifyTime(this.user, this)

        this.nextNotification = new Notification(nextNotifyDate);
    }

    planNextNotification() {
        this.createNotification()
        return this;
    }

    setUser(user: User) {
        this.user = user;
        return this;
    }

    setDone() {
        this.done = true;
        return this;
    }

    isDone() {
        return this.done;
    }

    increaseNotificationsCount() {
        this.notificationsNeed += 1;
        return this;
    }

    decreaseNotificationCount() {
        this.notificationsNeed -= 1;
        return this;
    }

    doneNotifications() {
        this.notificationsDone += 1;

        if (this.notificationsDone >= this.notificationsNeed) {
            this.done = true;
        }

        return this;
    }
}


