import { Op } from 'sequelize';

import { INotificationsRepository } from 'Repository/repository.interface';
import { NotificationsDTO } from 'DTO/NotificationsDTO';
import { RepositoryError } from 'Domain/errors';
import { TASK_DISPERSION_TIME } from 'Constants/time';
import { AbstractRepository } from 'Repository/abstract.repository';
import { ModelResult } from 'Types/models';
import { Shape } from 'Types/shape';

export class NotifyRepository extends AbstractRepository<NotificationsDTO> implements INotificationsRepository {
    model: any;
    private taskModel: any;

    constructor(db, taskModel) {
        super(db);

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

    protected includedModels = [];

    protected saveData = {
        user_id: undefined
    }

    protected ejectData(modelResult: ModelResult): NotificationsDTO {
        const data = modelResult?.dataValues;

        return data ? new NotificationsDTO(data) : null;
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

    protected mapDTO(notificationsDTO: NotificationsDTO): Shape<any> {
        return {
            id: notificationsDTO.id,
            date: notificationsDTO.date,
            answer: notificationsDTO.answer,
            ['task_id']: notificationsDTO.Task.id,
            done: notificationsDTO.done
        }
    }

    protected checkDTO(notificationsDTO: NotificationsDTO): void {
        const consistence = notificationsDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('Notifications Repository. NotificationsDTO is not consistent!');
        }
    }

    async save(notification: NotificationsDTO): Promise<boolean> {
        await this.model.update(this.mapDTO(notification), { where: this.modifiers })

        return true;
    }

    async remove(): Promise<boolean> {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
