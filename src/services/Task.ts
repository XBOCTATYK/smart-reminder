import { getTasksModel } from 'Models/Tasks';
import { model } from 'Utils/decorators/model';
import { Store } from 'Services/store';

export class TaskListService {
    private userId: number;
    private listProp = [];
    private isChanged = false;

    private diffNew = [];
    private diffUpdate = [];

    protected cacheNamePrefix = 'Model_Tasks_';

    @model('Tasks')
    static TaskModel: ReturnType<typeof getTasksModel>;
    static filter = {};

    constructor(userId: number) {
        this.userId = userId;
    }

    static async create(userId) {
        if (!userId) {
            throw new Error('User id is not defined!');
        }

        const newTaskList = new TaskListService(userId);
        const taskData = Store.get(`${newTaskList.cacheNamePrefix}${userId}`) as any;

        if (!taskData) {
            const StoreResult = await TaskListService.TaskModel.findAll({ where: { user_id: userId } });
            newTaskList.listProp = StoreResult ? StoreResult.map(item => item.dataValues) : [];
            Store.set(`${newTaskList.cacheNamePrefix}${userId}`, newTaskList.listProp);
        } else {
            newTaskList.listProp = taskData;
        }

        return newTaskList;
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

    addData(data) {

    }

    async done() {
        if (this.isChanged) {
            for (let item of this.diffUpdate) {
                await TaskListService.TaskModel.update(item, { where: { id: item.id } });
            }

            await TaskListService.TaskModel.bulkCreate(this.diffNew);
        }
    }
}


