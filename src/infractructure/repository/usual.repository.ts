import { IRepository } from './repository.interface';
import { TaskDTO } from '../DTO/TaskDTO';
import { NotificationsDTO } from '../DTO/NotificationsDTO';
import { UsualDTO } from '../DTO/UsualDTO';

export class UsualRepository implements IRepository {
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
            days: usualDTO.days,
            ['task_id']: usualDTO.Task.id,
        }
    }
}
