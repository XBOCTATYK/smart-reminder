import { IRepository } from './repository.interface';
import { Op } from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';
import { RepositoryError } from '../../domain/errors';

export class TaskRepository implements IRepository {
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

    protected ejectData(modelResult) {
        const data = modelResult?.dataValues;

        return data ? new TaskDTO(data) : null;
    }

    forUser(userId: string) {
        this.modifiers['user_id'] = userId;
        this.saveData['user_id'] = userId;
        return this;
    }

    actual() {
        this.modifiers.done = false;
        return this;
    }

    done() {
        this.modifiers.done = true;
        return this;
    }

    withId(id: string) {
        this.modifiers.id = id;
        return this;
    }

    inThisTime() {
        this.modifiers.date = {
            [Op.between]: [new Date(Date.now() - 36000), new Date()],
        }

        return this;
    }


    async get() {
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

    protected checkDTO(taskDTO: TaskDTO) {
        const consistence = taskDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('Task Repository. TaskDTO is not consistent!');
        }
    }

    async save(task: TaskDTO) {
        this.checkDTO(task);
        await this.model.update(
            this.mapDTO(task), {
            where: this.modifiers
        })
    }

    async create(task: TaskDTO) {
        this.checkDTO(task);
        await this.model.create({
            id: task.id,
            ...this.mapDTO(task)
        })
    }
}
