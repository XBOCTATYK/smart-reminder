import { Task } from '../../domain/entities/Task';
import { IRepository } from '../../infractructure/repository/repository.interface';

export interface ITaskCases {
    repository: IRepository;

    createTask(): Task
    getTask(): Task
    getTaskList(): Task[]
    deleteTask(): boolean
}
