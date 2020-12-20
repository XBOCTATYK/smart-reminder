import { GeneratedId } from '../decorators/generated-id';
import { NumberType } from '../decorators/validators/NumberType';
import { Required } from '../decorators/validators/Required';
import { DTOError } from '../../domain/errors';
import { UserDTO } from './UserDTO';
import { NotificationsDTO } from './NotificationsDTO';
import { DTO } from '../decorators/validators/DTO';
import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';
import { SkipNullableSetter } from 'Src/infractructure/decorators/methods/skipNullableSetter';

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

    @SkipNullableSetter
    setName(name?: string) {
        if (name.length > 1000) {
            throw new DTOError('TOO_LONG_NAME')
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
