import { IRepository } from './repository.interface';
import { Model } from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';
import { NotificationsDTO } from '../DTO/NotificationsDTO';

export class NotifyRepository implements IRepository {
    db: typeof Model;

    constructor(db) {
        this.db = db;
    }

    async findOne(id: string) {
        const task = await this.db.findOne({ where: { id } });

        return new NotificationsDTO(task?.dataValues);
    }
}
