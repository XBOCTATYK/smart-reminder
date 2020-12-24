import Model from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';
import { UserDTO } from '../DTO/UserDTO';
import { NotificationsDTO } from '../DTO/NotificationsDTO';

export interface IRepository<T> {
    model: typeof Model;

    get(): Promise<T[]>;
    save(T): Promise<boolean>;
    create(T): Promise<boolean>;
    remove(): Promise<boolean>;
}

export interface ITaskRepository extends IRepository<TaskDTO> {
    forUser(userId: number): ITaskRepository;
    actual(userId: number): ITaskRepository;
    done(userId: number): ITaskRepository;
    withId(userId: number): ITaskRepository;
    inThisTime(): ITaskRepository;
    get(): Promise<TaskDTO[]>;
}

export interface IUserRepository extends IRepository<UserDTO> {
    findOne(id: number): UserDTO
    byTaskId(taskId: number): UserDTO
}

export interface INotificationsRepository extends IRepository<NotificationsDTO> {
    findOne(id: string): NotificationsDTO
    findByTask(taskId: string): NotificationsDTO
    findByUser(userId: string): NotificationsDTO[]
}
