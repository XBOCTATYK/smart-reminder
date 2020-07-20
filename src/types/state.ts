import { InferValueTypes } from './infer-value-types';
import { STATES } from '../constants/states';

export type UserStateType = InferValueTypes<typeof STATES>
