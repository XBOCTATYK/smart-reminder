import { Store } from 'Services/store';

export class Entity {
    protected id;
    protected valueProp = {};
    protected cacheNamePrefix = 'Service_Model_';
    protected Store = Store;
    protected Model;
    protected isChanged = false;

    constructor(id) {
        this.id = id;
    }

    static async storeResult(newTask) {
        return await newTask.Model.findOne({ where: { id: newTask.id } });
    }

    static async create(id: number) {
        if (!id) {
            throw new Error('Task id is not defined!');
        }

        const newService = new Entity(id);
        const taskData = newService.Store.get(`${newService.cacheNamePrefix}${id}`) as any;

        if (!taskData) {
            const StoreResult = await this.storeResult(newService);
            newService.valueProp = StoreResult ? StoreResult.dataValues : {};
            newService.Store.set(`${newService.cacheNamePrefix}${id}`, newService.valueProp);
        } else {
            newService.valueProp = taskData;
        }

        return newService;
    }

    addData(data) {
        this.valueProp = { ...this.valueProp, ...data };
        this.Store.set(`${this.cacheNamePrefix}${this.id}`, this.valueProp);

        return this;
    }

    async done() {
        if (this.isChanged) {
            await this.Model.update(this.valueProp, { where: { id: this.id } });
        }
        return this;
    }

    value() {
        return this.valueProp;
    }
}

export class ListEntity {
    protected id;
    protected listProp = [];
    protected diffNew = [];
    protected diffUpdate = [];
    protected isChanged = false;
    protected cacheNamePrefix = 'Service_Model_List_';
    protected Store = Store;
    protected Model: any;

    constructor(id) {
        this.id = id;
    }

    static async storeResult(listEntity) {
        return [];
    }

    static async create(userId) {
        if (!userId) {
            throw new Error('User id is not defined!');
        }

        const newListEntity = new ListEntity(userId);
        const taskData = newListEntity.Store.get(`${newListEntity.cacheNamePrefix}${userId}`) as any;

        if (!taskData) {
            const StoreResult = await this.storeResult(newListEntity);
            newListEntity.listProp = StoreResult ? StoreResult.map(item => item.dataValues) : [];
            newListEntity.Store.set(`${newListEntity.cacheNamePrefix}${userId}`, newListEntity.listProp, 10);
        } else {
            newListEntity.listProp = taskData;
        }

        return newListEntity;
    }

    addData(data) {
        if (!data.id) return this;

        const existsIndex = this.listProp.findIndex(item => item.id === data.id);

        if (existsIndex) {
            this.listProp[existsIndex] = { ...this.listProp[existsIndex], ...data };

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

        this.Store.set(`${this.cacheNamePrefix}${this.id}`, this.listProp, 10);

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

    async done() {
        if (this.isChanged) {
            for (let item of this.diffUpdate) {
                await this.Model.update(item, { where: { id: item.id } });
            }

            await this.Model.bulkCreate(this.diffNew);
        }

        this.Store.del(`${this.cacheNamePrefix}${this.id}`);
    }
}
