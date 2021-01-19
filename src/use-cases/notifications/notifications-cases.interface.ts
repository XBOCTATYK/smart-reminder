import {
    INotificationsRepository,
    ITaskRepository,
    IUserRepository
} from '../../infractructure/repository/repository.interface';
import { NotificationsDTO } from '../../infractructure/DTO/NotificationsDTO';
import { Answer } from 'Constants/answers';
import { IDataInteractor } from '../data-interactor.interface';

export interface INotificationsCases extends IDataInteractor {
    userRepository: IUserRepository;

    sendNotifications(): Promise<boolean>
    getNotifications(dateTime: Date): Promise<NotificationsDTO[]>
    doneNotification(notifyId: string): Promise<boolean>;
    relocateNotification(notifyId: string, amount: string): Promise<boolean>;
    answer(notifyId: string, answer: Answer): Promise<boolean>;
}

export class NotificationsCases implements INotificationsCases {
    userRepository: IUserRepository;
    taskRepository: ITaskRepository;
    notificationRepository: INotificationsRepository;

    async sendNotifications(): Promise<boolean> {
        return true;
    }

    async getNotifications(dateTime?: Date): Promise<NotificationsDTO[]> {
        const repo = dateTime === undefined ? this.notificationRepository.inThisTime() : this.notificationRepository.inTime(dateTime);
        const notificationsDTOs = await repo.get();

        return notificationsDTOs;
    }

    answer(notifyId: string, answer: Answer): Promise<boolean> {
        return Promise.resolve(false);
    }

    doneNotification(notifyId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    relocateNotification(notifyId: string, amount: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}
