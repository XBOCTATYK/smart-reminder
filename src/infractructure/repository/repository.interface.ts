import Model from 'sequelize';
import { TaskDTO } from 'DTO/TaskDTO';
import { UserDTO } from 'DTO/UserDTO';
import { NotificationsDTO } from 'DTO/NotificationsDTO';

export interface ITimeCharacter<Repository> {
    inThisTime(): Repository;
    inTime(date: Date): Repository;
    ratherThan(date: Date): Repository;
    futureThan(date: Date): Repository;
}

export interface IActual<Repository> {
    actual(): Repository
    notActual(): Repository
}

export interface IRepository<T, REPO> {
    model: REPO;

    get(): Promise<T[]>;
    save(T): Promise<boolean>;
    create(T): Promise<boolean>;
    remove(): Promise<boolean>;
}

export interface ITaskRepository extends IRepository<TaskDTO, typeof Model>, ITimeCharacter<ITaskRepository> {
    actual(): ITaskRepository
    forUser(userId: number): ITaskRepository;
    done(): ITaskRepository;
    withId(taskId: string): ITaskRepository;
}

export interface IUserRepository extends IRepository<UserDTO, typeof Model> {
    active(): IUserRepository;
    inactive(): IUserRepository;
    withId(id: number): IUserRepository;
}

export interface INotificationsRepository extends IRepository<NotificationsDTO, typeof Model>, ITimeCharacter<INotificationsRepository>, IActual<INotificationsRepository> {
    withId(notifyId: string): INotificationsRepository;
    forTask(taskId: string): INotificationsRepository;
    forUser(userId: string): INotificationsRepository;
}
