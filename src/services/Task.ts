import { getTasksModel } from 'Models/Tasks';
import { model } from 'Utils/decorators/model';
import { Store } from 'Services/store';
import { Service } from 'Utils/decorators/Service';
import { AbstractService } from 'Services/AbstractService';

export class TaskListService {
    private id: number;
    private listProp = [];
    private isChanged = false;

    private diffNew = [];
    private diffUpdate = [];

    protected cacheNamePrefix = 'Model_Tasks_List_';

    @model('Tasks')
    protected Model: ReturnType<typeof getTasksModel>;
    protected Store = Store;

    constructor(userId: number) {
        this.id = userId;
    }

    static async storeResult(newTaskList) {
        return await newTaskList.Model.findAll({ where: { user_id: newTaskList.id } });
    }

    static async create(userId) {
        if (!userId) {
            throw new Error('User id is not defined!');
        }

        const newTaskList = new TaskListService(userId);
        const taskData = newTaskList.Store.get(`${newTaskList.cacheNamePrefix}${userId}`) as any;

        if (!taskData) {
            const StoreResult = await this.storeResult(newTaskList);
            newTaskList.listProp = StoreResult ? StoreResult.map(item => item.dataValues) : [];
            newTaskList.Store.set(`${newTaskList.cacheNamePrefix}${userId}`, newTaskList.listProp);
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
        if (!data.id) return this;

        const existsIndex = this.listProp.findIndex(item => item.id === data.id);

        if (existsIndex) {
            const modifiedListProp = { ...this.listProp[existsIndex], ...data };
            this.listProp[existsIndex] = modifiedListProp;

            const diffUpdateIndex = this.diffUpdate.findIndex(item => item.id === data.id);

            if (diffUpdateIndex) {
                this.diffUpdate[existsIndex] = { ...this.diffUpdate[existsIndex], ...data };
            } else {
                const diffNewIndex = this.diffNew.findIndex(item => item.id === data.id);

                if (diffUpdateIndex) {
                    this.diffNew[diffNewIndex] = { ...this.diffNew[diffNewIndex], ...data };
                } else {
                    this.diffUpdate.push(data);
                }
            }
        } else {
            this.listProp.push(existsIndex);
            this.diffNew.push(data);
        }

        this.Store.set(`${this.cacheNamePrefix}${this.id}`, this.listProp);

        return this;
    }

    async done() {
        if (this.isChanged) {
            for (let item of this.diffUpdate) {
                await this.Model.update(item, { where: { id: item.id } });
            }

            await this.Model.bulkCreate(this.diffNew);
        }

        this.Store.del(`${this.cacheNamePrefix}${this.id}`)
    }
}

// @ts-ignore
@Service
export class TaskService extends AbstractService {
    protected cacheNamePrefix = 'Model_Task_';

    @model('Tasks')
    private Model: ReturnType<typeof getTasksModel>;
    private Store = Store;

    constructor(taskId) {
        super();
        this.id = taskId;
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


