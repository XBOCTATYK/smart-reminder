import { IRepository } from './repository.interface';
import { TaskDTO } from '../DTO/TaskDTO';
import { UsualDTO } from '../DTO/UsualDTO';
import { RepositoryError } from '../../domain/errors';

export class UsualRepository implements IRepository<UsualDTO> {
    model: any;
    taskModel: any;

    constructor(db, taskModel) {
        this.model = db;
        this.taskModel = taskModel;
    }

    protected modifiers = {
        id: undefined,
        task_id: undefined,
        days: undefined,
        months: undefined,
        years: undefined,
        hours: undefined,
        minutes: undefined
    }

    protected includedModels = [];

    protected saveData = {
        user_id: undefined
    }

    protected ejectData(modelResult) {
        const data = modelResult?.dataValues;

        return data ? new TaskDTO(data) : null;
    }

    forTask(taskId: string) {
        this.modifiers['task_id'] = taskId;
        this.saveData['task_id'] = taskId;
        return this;
    }

    withId(id: string) {
        this.modifiers.id = id;
        return this;
    }

    private mapDTO(usualDTO: UsualDTO) {
        return {
            hours: usualDTO.hours,
            years: usualDTO.years,
            days: usualDTO.days,
            months: usualDTO.months,
            minutes: usualDTO.minutes,
            ['task_id']: usualDTO.Task.id
        }
    }

    protected checkDTO(usual: UsualDTO) {
        const consistence = usual.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('Usual Repository. UsualDTO is not consistent!');
        }
    }

    async get() {
        const taskList = await this.model.findAll({ where: this.modifiers, include: this.includedModels });
        return taskList.map(task => this.ejectData(task));
    }

    async save(usual: UsualDTO) {
        await this.model.update({
                ...this.mapDTO(usual)
            }, {
                where: this.modifiers
            })

        return true;
    }

    async create(usual: UsualDTO) {
        this.checkDTO(usual);
        await this.model.create({
            id: usual.id,
            ...this.mapDTO(usual)
        })

        return true;
    }

    async remove() {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
