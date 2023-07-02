import { InferValueTypes } from 'Types/infer-value-types';

export const ANSWERS = {
    DONE: 'D',
    CANCELLED: 'X',
    WAITING: 'O',
    YES: 'Y',
    NO: 'N',
    RESCHEDULED: 'R',
    SKIP: 'C'
} as const;

export type Answer = InferValueTypes<typeof ANSWERS>
