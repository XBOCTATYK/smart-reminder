import { Store } from './store';
import { STATES} from "../constants/states";
import { UserStateType} from "../types/stateTypes";

export class UserState {
    private id: number;
    private stateProp: string;
    private valueProp: Record<string, never> = {};
    private created: boolean;

    constructor(
        id: number | string,
        state?: UserStateType,
        data?: Record<string, never>
    ) {
        if (!id) {
            throw new Error('User id is not defined!');
        }

        const userData = Store.get(`State_${id}`);

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

    setState(state: string): UserState {
        Store.set(`State_${this.id}`, { ...this.valueProp, state });
        this.stateProp = state;
        this.created = false;
        return this;
    }

    state(): string {
        return this.stateProp;
    }

    addData(data) {
        const newData = { ...this.valueProp, ...data };
        Store.set(`State_${this.id}`, { ...newData, state: this.stateProp, });
        this.valueProp = newData;
        this.created = false;
        return this;
    }

    value(): Record<string, never> {
        return { ...this.valueProp };
    }

    done(): void {
        this.stateProp = STATES.DONE;
        Store.del(`State_${this.id}`);
    }
}

export function UserStateService(
    id: number | string,
    state?: UserStateType,
    data?: Record<string, never>
): UserState {
    return new UserState(id, state, data);
}