import { IUIState } from 'Src/ui/ui-interfaces';

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
}

export class TelegramStateMachine {
    stateMachine;
    state;
    prevState;

    constructor(stateMachine) {
        this.stateMachine = stateMachine;
    }

    init(state: IUIState) {
        this.state = state;
    }

    next(state: IUIState) {

    }
}
