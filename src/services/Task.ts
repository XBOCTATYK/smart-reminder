import { getTasksModel } from 'Models/Tasks';
import { model } from 'Utils/decorators/model';

export class TaskListService {
    static count = 0;

    private id: number;
    private userId: number;
    private cached = null;
    private listProp = [];

    @model('Tasks')
    public TaskModel: ReturnType<typeof getTasksModel>;
    public UserService: any;


    constructor(userId: number, cached = null) {
        this.userId = userId;
        this.cached = cached;
        this.id = TaskListService.count++;
    }

    public async get() {
        if (!this.cached) {
            this.listProp = this.cached;
        }
        const StoreResult = await this.TaskModel.findAll({ where: { user_id: this.userId } });
        this.listProp = StoreResult ? StoreResult.map(item => item.dataValues) : [];

        return this;
    }

    value() {
        return this.listProp;
    }

    first() {
        return this.listProp[0];
    }

    last() {
        return this.listProp[this.listProp.length - 1];
    }
}

export async function TaskList(userId: number, cached?): Promise<TaskListService> {
    const TaskListNew = new TaskListService(userId, cached);
    await TaskListNew.get();

    return TaskListNew;
}


