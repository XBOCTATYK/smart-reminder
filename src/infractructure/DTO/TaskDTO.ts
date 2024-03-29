import { GeneratedId } from 'Decorators/generated-id';
import { NumberType } from 'Decorators/validators/NumberType';
import { Required } from 'Decorators/validators/Required';
import { DTOError } from 'Domain/errors';
import { DTO } from 'Decorators/validators/DTO';
import { Positive } from 'Decorators/validators/Positive';
import { DateType } from 'Decorators/validators/DateType';
import { SkipNullableSetter } from 'Decorators/methods/skipNullableSetter';
import { UserDTO } from 'DTO/UserDTO';
import { NotificationsDTO } from 'DTO/NotificationsDTO';
import { DTO_ERROR } from 'Constants/errors';

import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';
import { getIdDefault } from 'DTO/helpers/getIdDefault';

export interface ITaskDTO {
    id?: string;
    name?: string;
    date?: Date;
    notificationsNeed?: number;
    notificationsDone?: number;
    type?: number;
    priority?: number;
    startDate?: Date;
    notifications?: NotificationsDTO[];
    user?: UserDTO;
    done: boolean;
}

@GeneratedId(getIdDefault<TaskDTO>())
export class TaskDTO implements ITaskDTO, ICheckRequired, IConsistent {
    @Required id: string;
    @Required name: string;
    @Required @DateType date: Date;
    @NumberType @Positive @Required notificationsNeed: number;
    @NumberType @Positive @Required notificationsDone: number;
    @NumberType @Required type?: number;
    @NumberType @Positive @Required priority?: number;
    @DateType startDate?: Date;
    @DTO user?: UserDTO;
    notifications?: NotificationsDTO[];
    @Required done: boolean;

    checkRequires(): boolean {
        return true;
    }

    constructor(data: ITaskDTO) {
        this.setName(data?.name);
        this.setDate(data?.date);
        this.setPriority(data?.priority);
        this.setNotificationsNeed(data?.notificationsNeed);
        this.setNotificationsDone(data?.notificationsDone);
        this.setType(data?.type);
        this.setStartDate(data?.startDate);
        this.setUser(data?.user);
    }

    @SkipNullableSetter
    setName(name?: string) {
        if (name.length > 1000) {
            throw new DTOError(DTO_ERROR.TOO_LONG_NAME)
        }

        this.name = name;
        return this;
    }

    @SkipNullableSetter
    setDate(date?: Date) {
        this.date = date;
        return this;
    }

    @SkipNullableSetter
    setPriority(amount?: number) {
        this.priority = amount;
        return this;
    }

    @SkipNullableSetter
    setNotificationsNeed(amount?: number) {
        this.notificationsNeed = amount;
        return this;
    }

    @SkipNullableSetter
    setNotificationsDone(amount?: number) {
        this.notificationsDone = amount;
        return this;
    }

    @SkipNullableSetter
    setType(type?: number) {
        this.type = type;
        return this;
    }

    setDone() {
        this.done = true;
    }

    setStartDate(date?: Date) {
        if (!date) {
            this.startDate = new Date();

            return this;
        }

        this.startDate = date;
        return this;
    }

    addNotification(notification: NotificationsDTO & IConsistent) {
        if (!notification.checkConsistence()) {
            throw new DTOError(DTO_ERROR.DATA_IS_NOT_CONSISTENCE)
        }

        notification.setTask(this);
        this.notifications.push(notification);
        return this;
    }

    setUser(user?: UserDTO) {
        if (!user) return this;

        this.user = user;
        return this;
    }

    checkConsistence() {
        return this.checkRequires();
    }
}
