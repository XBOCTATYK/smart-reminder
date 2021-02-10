import { Op } from 'sequelize';

import { ITaskRepository } from 'Repository/repository.interface';
import { TaskDTO } from 'DTO/TaskDTO';
import { RepositoryError } from 'Domain/errors';
import { TASK_DISPERSION_TIME } from 'Constants/time';

import { ModelResult } from 'Types/models';

export class TaskRepository implements ITaskRepository {
    model: any; //typeof Model;

    protected modifiers = {
        user_id: undefined,
        done: undefined,
        id: undefined,
        date: undefined
    };
    protected saveData = {
        user_id: undefined
    }

    constructor(db) {
        this.model = db;
    }

    protected ejectData(modelResult: ModelResult<TaskDTO>): TaskDTO | null {
        const data = modelResult?.dataValues;

        return data ? new TaskDTO(data) : null;
    }

    forUser(userId: number): ITaskRepository {
        this.modifiers['user_id'] = userId;
        this.saveData['user_id'] = userId;
        return this;
    }

    done(): ITaskRepository {
        this.modifiers.done = true;
        return this;
    }

    actual(): ITaskRepository {
        this.modifiers.done = false;
        return this;
    }

    withId(id: string): ITaskRepository {
        this.modifiers.id = id;
        return this;
    }

    inThisTime(): ITaskRepository {
        this.modifiers.date = {
            [Op.between]: [new Date(Date.now() - TASK_DISPERSION_TIME), new Date()],
        }

        return this;
    }

    ratherThan(date: Date): ITaskRepository {
        this.modifiers.date = {
            [Op.lt]: [date],
        }

        return this;
    }

    futureThan(date: Date): ITaskRepository {
        this.modifiers.date = {
            [Op.gt]: [date],
        }

        return this;
    }

    inTime(date: Date): ITaskRepository {
        const dateInMilliseconds = date.getTime();

        this.modifiers.date = {
            [Op.between]: [new Date(dateInMilliseconds - TASK_DISPERSION_TIME), date],
        }

        return this;
    }


    async get(): Promise<TaskDTO[]> {
        const taskList = await this.model.findAll({ where: this.modifiers });
        return taskList.map(task => this.ejectData(task));
    }

    private mapDTO(taskDTO: TaskDTO) {
        return {
            name: taskDTO.name,
            date: taskDTO.date,
            notificationsNeed: taskDTO.notificationsNeed,
            notificationsDone: taskDTO.notificationsDone,
            priority: taskDTO.priority || 2,
            startDate: taskDTO.startDate || new Date(),
            user_id: this.saveData.user_id || taskDTO.user?.id,
        }
    }

    protected checkDTO(taskDTO: TaskDTO): void {
        const consistence = taskDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('Task Repository. TaskDTO is not consistent!');
        }
    }

    async save(task: TaskDTO): Promise<boolean> {
        await this.model.update(
            this.mapDTO(task),
            { where: this.modifiers }
            )

        return true;
    }

    async create(task: TaskDTO | TaskDTO[]): Promise<boolean> {
        if (Array.isArray(task)) {
            const mappedEntities = task.map((task) => {
                this.checkDTO(task);

                return { id: task.id, ...this.mapDTO(task) }
            })

            await this.model.bulkCreate(mappedEntities);

            return true;
        }

        this.checkDTO(task);
        await this.model.create({
            id: task.id,
            ...this.mapDTO(task)
        })

        return true;
    }

    async remove(): Promise<boolean> {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
