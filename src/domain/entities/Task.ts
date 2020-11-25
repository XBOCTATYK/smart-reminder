import { getNextNotifyTime } from '../../utils/calculateTime';
import { User } from './User';
import { Notification } from './Notification';
import { BusinessError } from '../errors';

export class Task {
    user: User;
    date: Date;
    nextNotification: Notification;
    notificationsNeed: number;
    notificationsDone: number;
    done: boolean;

    constructor(taskData) {
        if (taskData.priority <= 0) {
            throw new BusinessError('ZERO_PRIORITY')
        }

        if (taskData.priority > 20) {
            throw new BusinessError('TOO_HIGH_PRIORITY')
        }

        if (taskData.notificationsNeed <= taskData.notificationsDone) {
            this.setDone();
        }

        this.date = taskData.date;
    }

    createNotification(user: User) {
        if (this.done) {
            throw new BusinessError('CANNOT_CREATE_NOTIFICATION_TASK_IS_DONE')
        }

        const nextNotifyDate = getNextNotifyTime(user, this.date)

        this.nextNotification = new Notification(nextNotifyDate);
    }

    planNextNotification() {
        this.createNotification()
    }

    setDone() {
        this.done = true;
    }

    isDone() {
        return this.done;
    }

    increaseNotificationsCount() {
        this.notificationsNeed += 1;
    }

    decreaseNotificationCount() {
        this.notificationsNeed -= 1;
    }

    doneNotifications() {
        this.notificationsDone += 1;

        if (this.notificationsDone >= this.notificationsNeed) {
            this.done = true;
        }
    }
}


