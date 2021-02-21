import { IUIState } from 'Src/ui/ui-interfaces';
import { IStateMachine, IStateMap } from 'Src/ui/state-machine.interface';
import { PendingTaskState } from 'Src/ui/states/pending-task.state';

export const STATES = {
    PENDING_TASK: 'PENDING_TASK', // state for bot waiting a new task
    START: 'START', // user is not subscribed
    FROM_TIME: 'FROM_TIME', // setting time after which notifications may sends
    TO_TIME: 'TO_TIME', // setting the time after which sending notifications is not allowed
    ENTER_TASK_NAME: 'ENTER_TASK_NAME', // bot waiting for input of task name
    ENTER_TASK_PRIORITY: 'ENTER_TASK_PRIORITY', // bot waiting for input of task priority
    ENTER_TASK_DATE: 'ENTER_TASK_DATE', // bot waiting for user input of task date
    ENTER_TASK_TIME: 'ENTER_TASK_TIME', // bot waiting for input of task time
    REPEATING_TASK: 'REPEATING_TASK', // bot waiting for input of repeating settings of task
    CREATING_TASK_ERROR: 'CREATING_TASK_ERROR', // state when task error happens. Bot waiting for next user action
    POSTPONE_TASK: 'POSTPONE_TASK', // ...
    DONE: 'DONE',
    UNSUBSCRIBED: 'UNSUBSCRIBED', // the user has disabled any notifications
} as const;

export type StateType = keyof typeof STATES;

export const TELEGRAM_UI_STATE_MACHINE = {
    [STATES.START]: {
        next: [
            STATES.FROM_TIME,
        ],
        actions: {
            [STATES.FROM_TIME]: () => undefined
        }
    },
    [STATES.FROM_TIME]: {
        next: [
            STATES.TO_TIME,
        ],
        actions: {
            [STATES.TO_TIME]: () => undefined,
        }
    },
    [STATES.PENDING_TASK]: {
        next: [
            STATES.ENTER_TASK_NAME,
            STATES.UNSUBSCRIBED,
        ],
        actions: {
            [STATES.ENTER_TASK_NAME]: () => undefined
        }
    },
    [STATES.ENTER_TASK_NAME]: {
        next: [
            STATES.ENTER_TASK_PRIORITY,
            STATES.PENDING_TASK,
        ],
        actions: {
            [STATES.ENTER_TASK_PRIORITY]: () => undefined,
            [STATES.PENDING_TASK]: () => undefined,
        }
    },
    [STATES.ENTER_TASK_PRIORITY]: {
        next: [
            STATES.ENTER_TASK_DATE,
            STATES.PENDING_TASK,
        ],
        actions: {
            [STATES.ENTER_TASK_DATE]: () => undefined,
            [STATES.PENDING_TASK]: () => undefined,
        }
    },
    [STATES.ENTER_TASK_DATE]: {
        next: [
            STATES.ENTER_TASK_TIME,
            STATES.PENDING_TASK,
        ],
        actions: {
            [STATES.ENTER_TASK_TIME]: () => undefined,
            [STATES.PENDING_TASK]: () => undefined,
        }
    },
    [STATES.ENTER_TASK_TIME]: {
        next: [
            STATES.PENDING_TASK,
        ],
        actions: {
            [STATES.PENDING_TASK]: () => undefined,
        }
    }
} as IStateMap;

export class TelegramStateMachine implements IStateMachine {
    stateMachine;
    defaultState;
    state;
    prevState;
    interactResult;

    constructor(stateMachine: IStateMap, defaultState: IUIState) {
        this.stateMachine = stateMachine;
        this.defaultState = defaultState;
    }

    init(state: IUIState) {
        this.state = state;
        this.state.onEnter();

        return this;
    }

    next(state: IUIState) {
        const hasNextState = this.stateMachine[this.state.name].next.includes(state.name);

        if (hasNextState) {
            this.prevState = this.state;
            this.state.onLeave();
            this.state = state;
            this.state.onEnter();
        } else {
            throw new Error('You attempt to enter to not allowed step')
        }

        return this;
    }

    prev() {
        this.state.onLeave();
        this.state = this.prevState;
        this.state.onEnter();

        return this;
    }

    default() {
        this.state.onLeave();
        this.state = this.defaultState;
        this.state.onEnter();

        return this;
    }

    interact<CTX = any>(ctx: CTX) {
        return this.interactResult = this.state.interact(ctx);
    }
}

export class TelegramStateMachineStrings {
    stateMachineClass;
    state;
    prevState;
    defaultState;

    private getStateByName(name: StateType) {
        switch (name) {
            case STATES.PENDING_TASK:
                return new PendingTaskState(name)
        }
    }

    constructor(stateMachine: IStateMap, defaultState: StateType) {
        this.stateMachineClass = new TelegramStateMachine(stateMachine, this.getStateByName(defaultState));
        this.defaultState = defaultState;
    }

    init(state: StateType) {
        this.stateMachineClass.init(this.getStateByName(state))

        return this;
    }

    next(state: StateType) {
        this.stateMachineClass.next(this.getStateByName(state));
        this.state = state;

        return this;
    }

    prev() {
        this.stateMachineClass.prev();
        this.state = this.prevState;

        return this;
    }

    default() {
        this.stateMachineClass.default();
        this.state = this.defaultState;
    }
}
