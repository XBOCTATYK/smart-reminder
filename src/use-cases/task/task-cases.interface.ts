import { IRepository } from '../../infractructure/repository/repository.interface';
import { TaskDTO } from '../../infractructure/DTO/TaskDTO';
import { IDataInteractor } from '../data-interactor.interface';

export interface ITaskCases extends IDataInteractor {
    userRepository: IRepository;

    createTask(taskInfo: TaskDTO): Promise<TaskDTO>;
    getTask(id: string): Promise<TaskDTO>;
    getTaskList(userId: number): Promise<TaskDTO[]>;
    getTaskListForNotify(userId: number): Promise<TaskDTO[]>;
    doneTask(id: string): Promise<boolean>;
    deleteTask(id: string): Promise<boolean>;
}
