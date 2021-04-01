import { Matcher } from './matcher';
import { STATES } from '../../constants/states';

const matcherFunctions = [
    {
        matcher: (text: string) => !!text.match(/Добавить/),
        transformer: () => 'ADD'
    }
]

export const enterTaskDataMatchers = matcherFunctions.map(item => new Matcher(STATES.PENDING_TASK, item.matcher, item.transformer));
