import { Store } from './store';


class UserState {
    private id: number;
    private stateProp = 'TASK_PENDING';

    constructor(id, state) {
        const userId = Store.get(id);

        if (!userId) {
            Store.set(id, state)
        }
    }

    setState(state) {
        Store.set(this.id, state);
        this.stateProp = state;
        return this;
    }

    state() {
        return this.stateProp;
    }
}

export function UserService(id, state) {
    return new UserState(id, state);
}
