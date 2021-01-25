import { INotificationsRepository, IRepository } from './repository.interface';
import { Op } from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';
import { NotificationsDTO } from '../DTO/NotificationsDTO';
import { RepositoryError } from '../../domain/errors';
import { TASK_DISPERSION_TIME } from '../../constants/time';

export class NotifyRepository implements INotificationsRepository {
    model: any;
    taskModel: any;

    constructor(db, taskModel) {
        this.model = db;
        this.taskModel = taskModel;
    }

    protected modifiers = {
        id: undefined,
        date: undefined,
        task_id: undefined,
        done: undefined,
        answer: undefined
    };

    protected includedModels = []

    protected saveData = {
        user_id: undefined
    }

    protected ejectData(modelResult) {
        const data = modelResult?.dataValues;

        return data ? new TaskDTO(data) : null;
    }

    forUser(userId: string): INotificationsRepository {
        this.includedModels.push(this.taskModel);
        this.saveData['user_id'] = userId;
        return this;
    }

    forTask(taskId: string): INotificationsRepository {
        this.modifiers['task_id'] = taskId;
        this.saveData['task_id'] = taskId;
        return this;
    }

    actual(): INotificationsRepository {
        this.modifiers.done = false;
        return this;
    }

    notActual(): INotificationsRepository {
        this.modifiers.done = true;
        return this;
    }

    done(): INotificationsRepository {
        this.modifiers.done = true;
        return this;
    }

    withId(id: string): INotificationsRepository {
        this.modifiers.id = id;
        return this;
    }

    inThisTime(): INotificationsRepository {
        this.modifiers.date = {
            [Op.between]: [new Date(Date.now() - TASK_DISPERSION_TIME), new Date()],
        }

        return this;
    }

    ratherThan(date: Date): INotificationsRepository {
        this.modifiers.date = {
            [Op.lt]: [date],
        }

        return this;
    }

    futureThan(date: Date): INotificationsRepository {
        this.modifiers.date = {
            [Op.gt]: [date],
        }

        return this;
    }

    inTime(date: Date): INotificationsRepository {
        const dateInMilliseconds = date.getTime();

        this.modifiers.date = {
            [Op.between]: [new Date(dateInMilliseconds - TASK_DISPERSION_TIME), date],
        }

        return this;
    }

    private mapDTO(notificationsDTO: NotificationsDTO) {
        return {
            date: notificationsDTO.date,
            answer: notificationsDTO.answer,
            ['task_id']: notificationsDTO.Task.id,
            done: notificationsDTO.done
        }
    }

    protected checkDTO(notificationsDTO: NotificationsDTO) {
        const consistence = notificationsDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('Notifications Repository. NotificationsDTO is not consistent!');
        }
    }

    protected diff(notifications: NotificationsDTO[]) {
        return {}
    }

    async get() {
        const taskList = await this.model.findAll({ where: this.modifiers, include: this.includedModels });
        return taskList.map(task => this.ejectData(task));
    }

    async save(notification: NotificationsDTO | NotificationsDTO[]) {

        if (Array.isArray(notification)) {
            const diffs = this.diff(notification);

            await this.model.update(diffs, { where: this.modifiers })
        } else {
            await this.model.update(this.mapDTO(notification), { where: this.modifiers })
        }

        return true;
    }

    async create(notification: NotificationsDTO) {
        this.checkDTO(notification);
        await this.model.create({
            id: notification.id,
            ...this.mapDTO(notification)
        })

        return true;
    }

    async remove() {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
