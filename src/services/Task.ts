import { getTasksModel } from 'Models/Tasks';
import { model } from 'Utils/decorators/model';
import { Store } from 'Services/store';
import { Entity, ListEntity } from 'Services/Entity';

export class TaskListService extends ListEntity {
    protected id: number;

    protected cacheNamePrefix = 'Model_Tasks_List_';
    protected listProp = [];

    @model('Tasks')
    protected Model: ReturnType<typeof getTasksModel>;
    protected Store = Store;

    constructor(userId: number) {
        super(userId);
    }

    static async storeResult(newTaskList) {
        return await newTaskList.Model.findAll({ where: { user_id: newTaskList.id } });
    }

}

export class TaskService extends Entity {
    protected cacheNamePrefix = 'Model_Task_';

    @model('Tasks')
    protected Model: ReturnType<typeof getTasksModel>;
    protected Store = Store;

    constructor(taskId) {
        super(taskId);
    }

    static async storeResult(newTask) {
        return await newTask.Model.findOne({ where: { id: newTask.id } });
    }

    static async create(taskId: number) {
        if (!taskId) {
            throw new Error('Task id is not defined!');
        }

        const newTask = new TaskService(taskId);
        const taskData = newTask.Store.get(`${newTask.cacheNamePrefix}${taskId}`) as any;

        if (!taskData) {
            const StoreResult = await this.storeResult(newTask);
            newTask.valueProp = StoreResult ? StoreResult.dataValues : {};
            newTask.Store.set(`${newTask.cacheNamePrefix}${taskId}`, newTask.valueProp);
        } else {
            newTask.valueProp = taskData;
        }

        return newTask;
    }

}


