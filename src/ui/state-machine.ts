export const STATES = {
    PENDING_TASK: 'PENDING_TASK',
    START: 'START',
    FROM_TIME: 'FROM_TIME',
    TO_TIME: 'TO_TIME',
    ENTER_TASK_NAME: 'ENTER_TASK_NAME',
    ENTER_TASK_PRIORITY: 'ENTER_TASK_PRIORITY',
    ENTER_TASK_DATE: 'ENTER_TASK_DATE',
    ENTER_TASK_TIME: 'ENTER_TASK_TIME',
    REPEATING_TASK: 'REPEATING_TASK',
    CREATING_TASK_ERROR: 'CREATING_TASK_ERROR',
    POSTPONE_TASK: 'POSTPONE_TASK',
    DONE: 'DONE',
} as const;

const STATE_MACHINE = {
    [STATES.PENDING_TASK]: {
        next: [
            STATES.ENTER_TASK_NAME,
        ],
        actions: {
            [STATES.ENTER_TASK_NAME]: () => {}
        }
    },
    [STATES.START]: {
        next: [
            STATES.FROM_TIME,
        ],
        actions: {
            [STATES.FROM_TIME]: () => {}
        }
    }
}
