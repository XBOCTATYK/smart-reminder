import { Time } from '../../utils/date-services/extended-date';
import { Matcher } from './matcher';
import { STATES } from '../../constants/states';

const matcherFunctions = [
    { matcher: (text: string) => !!text.match(/[\d]{1,2}:[\d]{1,2}/), transformer: (text: string) => Time.of(text).get() },
    { matcher: (text: string) => !!text.match(/[\d]{1,2}(ч|час|часа|часов)/), transformer: (text: string) => Time.of(`${parseInt(text)}:00`).get() },
    { matcher: (text: string) => !!text.match(/через [\d]{1,2}(ч|час|часа|часов)/), transformer: (text: string) => Time.of(new Date).addHours(parseInt(text)).get() },
];

export const enterTaskTimeTransfomers = matcherFunctions.map( item => new Matcher(STATES.ENTER_TASK_TIME, item.matcher, item.transformer));
