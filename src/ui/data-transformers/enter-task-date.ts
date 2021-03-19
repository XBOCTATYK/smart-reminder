import { ExtendedDate } from '../../utils/date-services/extended-date';
import { STATES } from '../../constants/states';
import { Matcher } from './matcher';

const matcherFunctions = [
    { matcher: (text: string) => !!text.match(/[\d]{1,2}\.[\d]{1,2}\.[\d]{1,2}/), transformer: (text: string) => ExtendedDate.of(text).get() },
    { matcher: (text: string) => !!text.match(/Сегодня/), transformer: () => ExtendedDate.of(new Date).startOfDay().get() },
    { matcher: (text: string) => !!text.match(/Завтра/), transformer: () => ExtendedDate.of(new Date).addDays(1).startOfDay().get() },
];

export const enterTaskDataMatchers = matcherFunctions.map( item => new Matcher(STATES.ENTER_TASK_DATE, item.matcher, item.transformer));
