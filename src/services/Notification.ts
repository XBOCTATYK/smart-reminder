import { v1 } from 'uuid';

import { getNextNotifyTime } from 'Utils/calculateTime';
import { model } from 'Utils/decorators/model';
import { UserService } from './User';
import { NOTIFICATION_ENTITY_KEY } from 'Constants/enitityNames';

class Notification {

    id: number;

    @model(NOTIFICATION_ENTITY_KEY)
    static NotifiesModel;
    static User = UserService;

    protected valueProp = {};

    static async create(task) {
        const newNotification = new Notification(task.id);

        const StoreResult = await Notification.NotifiesModel.findOne(task.id);
        newNotification.valueProp = StoreResult ? StoreResult.dataValues : {};

        return newNotification;
    }

    constructor(taskId) {
        this.id = taskId;
    }

    value() {
        return this.valueProp;
    }

    done() {

    }
}

export class NextNotification extends Notification {
    static async create(task) {
        const currentUser = await super.User.create(task.user_id);
        const nextNotify = getNextNotifyTime(currentUser.value(), task);
        const newNextNotification = new NextNotification(task.id);

        const value = {
            id: v1(),
            task_id: task.id,
            date: nextNotify.date,
            time: nextNotify.time
        };

        await super.NotifiesModel.create(value);
        newNextNotification.valueProp = value;

        return newNextNotification;
    }
}
