import {
    INotificationsRepository,
    ITaskRepository,
    IUserRepository
} from 'Repository/repository.interface';
import { NotificationsDTO } from 'DTO/NotificationsDTO';
import { Answer } from 'Constants/answers';

import { INotificationsCases } from './notifications-cases.interface';

export class NotificationsCases implements INotificationsCases {
    userRepository: IUserRepository;
    taskRepository: ITaskRepository;
    notificationRepository: INotificationsRepository;

    constructor(
        userRepository: IUserRepository,
        taskRepository: ITaskRepository,
        notificationRepository: INotificationsRepository,
    ) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
    }

    async sendNotifications(): Promise<boolean> {
        return true;
    }

    async getNotifications(dateTime?: Date): Promise<NotificationsDTO[]> {
        const repo = dateTime === undefined ? this.notificationRepository.inThisTime() : this.notificationRepository.inTime(dateTime);
        const notificationsDTOs = await repo.get();

        return notificationsDTOs;
    }

    async answer(notifyId: string, answer: Answer): Promise<boolean> {
        return Promise.resolve(false);
    }

    async doneNotification(notifyId: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    async relocateNotification(notifyId: string, amount: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}
