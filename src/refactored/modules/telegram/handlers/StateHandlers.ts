import {UserStateType} from "../../../../types/state";
import {UserState} from "../services/UserState";
import {STATES} from "../constants/states";

type UserStateFactory = (id: (number | string), state?: UserStateType, data?: Record<string, any>) => UserState

export class StateHandlers {
    private readonly userStateFactory: UserStateFactory
    
    constructor(userStateFactory: UserStateFactory) {
        this.userStateFactory = userStateFactory;
    }
    
    start = ({ fromTime, toTime, userId }: { fromTime: Date, toTime: Date, userId: number }): void => {
        const state = STATES.FROM_TIME;
        this.userStateFactory(userId, state, { fromTime, toTime });
    }
}