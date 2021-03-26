import { ExtendedDate } from '../../utils/date-services/extended-date';
import { STATES } from '../../constants/states';
import { Matcher } from './matcher';

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
        matcher: (text: string) => !!text.match(/через ([\d]{1,2}) ?(день|дня|дней|деньков|денечков|дн$|д$)+/)[2],
        transformer: (text: string) => {
            const [ , days ] = text.match(/через ([\d]+) ?(день|дня|дней|деньков|денечков|дн$|д$|)+/);
            return ExtendedDate.of(new Date).addDays(parseInt(days)).startOfDay().get()
        }
    },
    {
        matcher: (text: string) => !!text.match(/через ([\d]{1,2}) ?(час|часа|часов|часика|часиков|часик|чс$|ч$)+/)[2],
        transformer: (text: string) => {
            const [ , hours ] = text.match(/через ([\d]+) ?(час|часа|часов|часика|часиков|часик|чс$|ч$|)+/);
            return ExtendedDate.of(new Date).addHours(parseInt(hours)).startOfDay().get()
        }
    },
    {
        matcher: (text: string) => !!text.match(/через ([\d]{1,2}) ?(минуты|минуток|минут|мин$|мн$|м$)+/)[2],
        transformer: (text: string) => {
            const [ , minutes ] = text.match(/через ([\d]+) ?(час|часа|часов|часика|часиков|часик|чс$|ч$)+/);
            return ExtendedDate.of(new Date).addMinutes(parseInt(minutes)).startOfDay().get()
        }
    }
];

export const enterTaskDataMatchers = matcherFunctions.map(item => new Matcher(STATES.ENTER_TASK_DATE, item.matcher, item.transformer));
