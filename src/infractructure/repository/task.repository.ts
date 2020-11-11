import { IRepository } from './repository.interface';
import { Model, Op } from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';

export class TaskRepository implements IRepository {
    db: typeof Model;
    private modifiers = {
        user_id: undefined,
        done: undefined,
        id: undefined,
        date: undefined
    };

    constructor(db) {
        this.db = db;
    }

    private ejectData(modelResult: Model<{}, {}>) {
        const data = modelResult?.dataValues;

        return data ? new TaskDTO(data) : null;
    }

    forUser(userId: string) {
        this.modifiers['user_id'] = userId;
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
    }

    inThisTime() {
        this.modifiers.date = {
            [Op.between]: [new Date(Date.now() - 36000), new Date()],
        }
    }


    async get() {
        const taskList = await this.db.findAll({ where: this.modifiers });
        const resultDTO = taskList.map(task => this.ejectData(task));

        return resultDTO;
    }
}
