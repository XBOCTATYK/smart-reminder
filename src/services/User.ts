import { Store } from './store';
import { STATES } from 'Constants/states';
import { UserStateType } from 'Types/state';

class UserState {
    private id: number;
    private stateProp: string;
    private dataProp: any = {};

    constructor(id: number | string, state?: UserStateType, data?) {
        if (!id) {
            throw new Error('User id is not defined!');
        }

        const userData = Store.get(id) as any;

        console.log(userData)

        if (!userData) {
            const defaultState = state || STATES.PENDING_TASK;

            Store.set(id, { state: defaultState, ...data });
            this.stateProp = defaultState;
            this.dataProp = data;
        } else {
            this.stateProp = userData.state;
            this.dataProp = { ...userData };
        }

        this.id = Number(id);
    }

    setState(state) {
        Store.set(this.id, { ...this.dataProp, state });
        this.stateProp = state;
        return this;
    }

    state() {
        return this.stateProp;
    }

    addData(data) {
        const newData = { ...this.dataProp, ...data };
        Store.set(this.id, { ...newData, state: this.stateProp, });
        this.dataProp = newData;
        return this;
    }

    data() {
        return { ...this.dataProp };
    }

    done() {
        this.stateProp = STATES.DONE;
        Store.del(this.id);
    }
}

export function UserService(id: number | string, state?: UserStateType, data?) {
    return new UserState(id, state, data);
}
