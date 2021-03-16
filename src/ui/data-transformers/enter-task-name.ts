import { STATES } from '../../constants/states';
import { Matcher } from './matcher';

export const enterTaskNameMatcher = new Matcher(STATES.ENTER_TASK_NAME, () => true, (text: string) => text);
