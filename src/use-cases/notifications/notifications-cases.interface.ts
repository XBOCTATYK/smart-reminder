import { IUserRepository } from '../../infractructure/repository/repository.interface';
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
