import {
    INotificationsRepository,
    IRepository,
    ITaskRepository,
    IUserRepository
} from 'Repository/repository.interface';
import { UserDTO } from 'DTO/UserDTO';
import { NotificationsDTO } from 'DTO/NotificationsDTO';
import { User } from 'Domain/entities/User';
import { Task } from 'Domain/entities/Task';
import { TaskDTO } from 'DTO/TaskDTO';

import { IUserCases } from '../user/user-cases.interface';
import { ITaskCases } from './task-cases.interface';

export class TaskCases implements ITaskCases {
    userRepository: IUserRepository;
    notificationRepository: INotificationsRepository;
    taskRepository: ITaskRepository;
    userCases: IUserCases;

    constructor(
        userRepository: IUserRepository,
        notificationRepository: INotificationsRepository,
        taskRepository: ITaskRepository,
        userCases: IUserCases,
    ) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.taskRepository = taskRepository;
        this.userCases = userCases;
    }

    async storeTask(user: User): Promise<boolean> {
        const { tasks } = user;

        const taskDTOs = tasks.map((task) => {
            return new TaskDTO({ ...task, user: new UserDTO({ ...user }) });
        })

        await this.taskRepository.forUser(user.id).create(taskDTOs);

        return true;
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

    async getTask(id: string): Promise<Task> {
        const [taskDTO] = await this.taskRepository.withId(id).get();
        return new Task(taskDTO);
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
