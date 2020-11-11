import Model from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';
import { UserDTO } from '../DTO/UserDTO';
import { NotificationsDTO } from '../DTO/NotificationsDTO';

export interface IRepository {
    model: typeof Model;

}

export interface ITaskRepository extends IRepository {
    forUser(userId: number): ITaskRepository;
    actual(userId: number): ITaskRepository;
    done(userId: number): ITaskRepository;
    withId(userId: number): ITaskRepository;
    inThisTime(): ITaskRepository;
    get(): Promise<TaskDTO[]>;
}

export interface IUserRepository extends IRepository {
    findOne(id: number): UserDTO
    byTaskId(taskId: number): UserDTO
    findAll(): UserDTO[]
}

export interface INotificationsRepository extends IRepository {
    findOne(id: string): NotificationsDTO
    findByTask(taskId: string): NotificationsDTO
    findByUser(userId: string): NotificationsDTO[]
    findAll(): NotificationsDTO[]
}

export interface IParams extends IRepository {
    get()
}
