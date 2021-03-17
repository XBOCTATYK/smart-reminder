import { Matcher } from './matcher';
import { STATES } from '../../constants/states';

export const enterTaskPriorityMatcher = new Matcher(STATES.ENTER_TASK_PRIORITY, text => !!text.match(/[\d]/g), text => text)
