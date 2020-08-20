import { Store } from './store';
import { STATES } from 'Constants/states';
import { UserStateType } from 'Types/state';
import { model } from 'Utils/decorators/model';
import { getUserModel } from 'Models/User';

class UserState {
    private id: number;
    private stateProp: string;
    private valueProp: any = {};
    private created: boolean;

    constructor(id: number | string, state?: UserStateType, data?) {
        if (!id) {
            throw new Error('User id is not defined!');
        }

        const userData = Store.get(`State_${id}`) as any;

        if (!userData) {
            const defaultState = state || STATES.PENDING_TASK;

            Store.set(`State_${id}`, { state: defaultState, ...data });
            this.stateProp = defaultState;
            this.valueProp = data;
            this.created = true;
        } else {
            this.stateProp = userData.state;
            this.valueProp = { ...userData };
            this.created = false;
        }

        this.id = Number(id);
    }

    isCreated() {
        return this.created;
    }

    setState(state) {
        Store.set(`State_${this.id}`, { ...this.valueProp, state });
        this.stateProp = state;
        this.created = false;
        return this;
    }

    state() {
        return this.stateProp;
    }

    addData(data) {
        const newData = { ...this.valueProp, ...data };
        Store.set(`State_${this.id}`, { ...newData, state: this.stateProp, });
        this.valueProp = newData;
        this.created = false;
        return this;
    }

    value() {
        return { ...this.valueProp };
    }

    done() {
        this.stateProp = STATES.DONE;
        Store.del(`State_${this.id}`);
    }
}

export function UserStateService(id: number | string, state?: UserStateType, data?) {
    return new UserState(id, state, data);
}

export class UserService {
    private id: number;
    private valueProp = {};
    private isChanged = false;

    @model('User')
    private Model: ReturnType<typeof getUserModel>;

    static async create(userId) {
        if (!userId) {
            throw new Error('User id is not defined!');
        }

        const userData = Store.get(`Model_${userId}`) as any;

        const newUser = new UserService(userId);

        if (!userData) {
            const StoreResult = await newUser.Model.findOne({ where: { id: userId } });
            newUser.valueProp = StoreResult ? StoreResult.dataValues : {};
        } else {
            newUser.valueProp = userData;
        }

        return newUser;
    }

    constructor(userId) {
        this.id = Number(userId);
    }

    addData(data) {
        const newData = { ...this.valueProp, ...data };
        this.valueProp = { ...newData };
        Store.set(`Model_${this.id}`, { ...newData });

        this.isChanged = true;

        return this;
    }

    value() {
        return this.valueProp;
    }

    async done() {
        if (this.isChanged) {
            await this.Model.update(this.valueProp, { where: { id: this.id } });
            Store.del(`Model_${this.id}`);
        }
    }
}
