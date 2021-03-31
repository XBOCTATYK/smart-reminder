import { Matcher } from './matcher';
import { STATES } from '../../constants/states';

const matcherFunctions = [

]

export const enterTaskDataMatchers = matcherFunctions.map(item => new Matcher(STATES.PENDING_TASK, item.matcher, item.transformer));
