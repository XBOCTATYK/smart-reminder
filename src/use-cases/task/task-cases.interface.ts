import {
    INotificationsRepository,
    ITaskRepository,
    IUserRepository
} from 'Repository/repository.interface';
import { TaskDTO } from 'DTO/TaskDTO';
import { User } from 'Domain/entities/User';
import { Task } from 'Domain/entities/Task';

import { IDataInteractor } from '../data-interactor.interface';
import { IUserCases } from '../user/user-cases.interface';

export interface ITaskCases extends IDataInteractor {
    userRepository: IUserRepository;
    taskRepository: ITaskRepository;
    notificationRepository: INotificationsRepository;
    userCases: IUserCases;

    storeTask(user: User): Promise<boolean>;
    getTask(id: string): Promise<Task>;
    getTaskList(userId: number): Promise<TaskDTO[]>;
    getTaskListForNotify(userId: number): Promise<TaskDTO[]>;
    doneTask(id: string): Promise<boolean>;
    deleteTask(id: string): Promise<boolean>;
}
