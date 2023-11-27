import { ExtendedDate } from '../../utils/date-services/extended-date';
import { STATES } from '../../constants/states';
import { Matcher } from './matcher';
import {
    dayCountReg,
    daysRegs,
} from '../../constants/regexps/time';

const matcherFunctions = [
    {
        matcher: (text: string) => !!text.match(/[\d]{1,2}\.[\d]{1,2}\.[\d]{1,2}/),
        transformer: (text: string) => ExtendedDate.of(text).get()
    },
    {
        matcher: (text: string) => !!text.match(/Сегодня/),
        transformer: () => ExtendedDate.of(new Date).startOfDay().get()
    },
    {
        matcher: (text: string) => !!text.match(/Завтра/),
        transformer: () => ExtendedDate.of(new Date).addDays(1).startOfDay().get()
    },
    {
        matcher: (text: string) => !!text.match(/Послезавтра/),
        transformer: () => ExtendedDate.of(new Date).addDays(2).startOfDay().get()
    },
    {
        matcher: (text: string) => !!text.match(/Послепослезавтра/),
        transformer: () => ExtendedDate.of(new Date).addDays(3).startOfDay().get()
    },
    {
        matcher: (text: string) => !!text.match(/Послепослепослезавтра/),
        transformer: () => ExtendedDate.of(new Date).addDays(4).startOfDay().get()
    },
    {
        matcher: (text: string) => !!text.match(new RegExp(`${dayCountReg} ?${daysRegs}`)),
        transformer: (text: string) => {
            const [ , days ] = text.match(new RegExp(`${dayCountReg} ?${daysRegs}`));
            return ExtendedDate.of(new Date).addDays(parseInt(days)).startOfDay().get()
        }
    },
];

export const enterTaskDataMatchers = matcherFunctions.map(item => new Matcher(STATES.ENTER_TASK_DATE, item.matcher, item.transformer));
