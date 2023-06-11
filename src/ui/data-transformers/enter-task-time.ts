import { ExtendedDate, Time } from '../../utils/date-services/extended-date';
import { Matcher } from './matcher';
import { STATES } from '../../constants/states';
import { hourCountReg, hoursRegs, minuteCountReg, minutesRegs } from '../../constants/regexps/time';

const matcherFunctions = [
    { matcher: (text: string) => !!text.match(/[\d]{1,2}:[\d]{1,2}/), transformer: (text: string) => Time.of(text).get() },
    {
        matcher: (text: string) => !!text.match(new RegExp(`${hourCountReg} ?${hoursRegs}`))[2],
        transformer: (text: string) => {
            const [ , hours ] = text.match(new RegExp(`${hourCountReg} ?${hoursRegs}`));
            return ExtendedDate.of(new Date).addHours(parseInt(hours)).startOfDay().get()
        }
    },
    {
        matcher: (text: string) => !!text.match(new RegExp(`${minuteCountReg} ?${minutesRegs}`))[2],
        transformer: (text: string) => {
            const [ , minutes ] = text.match(new RegExp(`${minuteCountReg} ?${minutesRegs}`));
            return ExtendedDate.of(new Date).addMinutes(parseInt(minutes)).startOfDay().get()
        }
    },
];

export const enterTaskTimeTransfomers = matcherFunctions.map( item => new Matcher(STATES.ENTER_TASK_TIME, item.matcher, item.transformer));
