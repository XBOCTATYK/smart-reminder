import { IRepository, ITaskRepository } from '../../infractructure/repository/repository.interface';
import { TaskDTO } from '../../infractructure/DTO/TaskDTO';
import { IDataInteractor } from '../data-interactor.interface';
import { UserDTO } from '../../infractructure/DTO/UserDTO';
import { NotificationsDTO } from '../../infractructure/DTO/NotificationsDTO';
import { IUserCases } from '../user/user-cases.interface';
import { Task } from '../../domain/entities/Task';

export interface ITaskCases extends IDataInteractor {
    userRepository: IRepository<UserDTO>;
    taskRepository: ITaskRepository;
    notificationRepository: IRepository<NotificationsDTO>;
    userCases: IUserCases;

    createTask(taskInfo: Task): Promise<TaskDTO>;
    getTask(id: string): Promise<TaskDTO>;
    getTaskList(userId: number): Promise<TaskDTO[]>;
    getTaskListForNotify(userId: number): Promise<TaskDTO[]>;
    doneTask(id: string): Promise<boolean>;
    deleteTask(id: string): Promise<boolean>;
}

export class TaskCases implements ITaskCases {
    userRepository: IRepository<UserDTO>;
    notificationRepository: IRepository<NotificationsDTO>;
    taskRepository: ITaskRepository;
    userCases: IUserCases;

    async createTask(userId: number, taskInfo: Task): Promise<TaskDTO> {
        const taskDTO = new TaskDTO({ ...taskInfo, user: new UserDTO({ ...taskInfo.user }) });

        await this.taskRepository.forUser(userId).create(taskDTO);
        return taskDTO;
    }

    async deleteTask(id: string): Promise<boolean> {
        await this.taskRepository.withId(id).remove();

        return true;
    }

    async doneTask(id: string): Promise<boolean> {
        const [taskDTO] = await this.taskRepository.withId(id).get();

        taskDTO.setDone();
        await this.taskRepository.withId(id).save(taskDTO);

        return true;
    }

    async getTask(id: string): Promise<TaskDTO> {
        const [taskDTO] = await this.taskRepository.withId(id).get();
        return taskDTO;
    }

    async getTaskList(userId: number): Promise<TaskDTO[]> {
        const user = this.userCases.checkUser(userId);
        return this.taskRepository
            .forUser(userId)
            .actual()
            .get();
    }

    async getTaskListForNotify(userId: number): Promise<TaskDTO[]> {
        return this.taskRepository
            .forUser(userId)
            .inThisTime()
            .actual()
            .get();
    }

    async notifyAboutTask(onGetTasks: (tasks: TaskDTO[]) => Promise<any>) {
        const tasks = await this.taskRepository.inThisTime().actual().get();
        const result = await onGetTasks(tasks);

        if (result) {
            tasks.forEach(async (task) => {
                task.setDone();
                await this.taskRepository.withId(task.id).save(task);
            })

            return true;
        }
    }
}
