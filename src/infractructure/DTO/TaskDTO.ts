import { GeneratedId } from '../decorators/generated-id';
import { NumberType } from '../decorators/validators/NumberType';
import { Required } from '../decorators/validators/Required';
import { DTOError } from '../../domain/errors';
import { UserDTO } from './UserDTO';
import { NotificationsDTO } from './NotificationsDTO';
import { DTO } from '../decorators/validators/DTO';
import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';

interface ITaskDTO {
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
}

@GeneratedId
export class TaskDTO implements ITaskDTO, ICheckRequired, IConsistent {
    @Required id: string;
    @Required name: string;
    @Required @DateType date: Date;
    @NumberType @Required notificationsNeed: number;
    @NumberType @Required notificationsDone: number;
    @NumberType @Required type?: number;
    @NumberType @Required priority?: number;
    @DateType startDate?: Date;
    @DTO user?: UserDTO;
    notifications?: NotificationsDTO[];
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

    setName(name?: string) {
        if (!name) return;

        if (name.length > 1000) {
            throw new DTOError('TOO_LONG_NAME')
        }

        this.name = name;
        return this;
    }

    setDate(date?: Date) {
        if (!date) return;

        this.date = date;
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
        return this;
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

    addNotification(notification: NotificationsDTO & IConsistent) {
        if (!notification.checkConsistence()) {
            throw new DTOError('DATA_IS_NOT_CONSISTENCE')
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
