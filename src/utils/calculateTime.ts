import parse from 'date-fns/parse';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import subHours from 'date-fns/subHours';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import { DATE_FORMAT, TIME_FORMAT } from 'Src/constants/formats';


const dateFnsConfig = { weekStartsOn: 1 };

const MINS_IN_DAY = 1440;

function getRange(from, to) {
    const fromTime = parse(from, TIME_FORMAT, new Date(1970, 1, 2));
    const toTime = parse(to, TIME_FORMAT, new Date(1970, 1, 2));

    const fromInMinutes = differenceInMinutes(fromTime, startOfDay(fromTime));
    const toInMinutes = differenceInMinutes(toTime, startOfDay(fromTime));

    return { fromInMinutes, toInMinutes}
}

function getAvailableTime(from, to, dateTime) {
    const dayStart = addHours(startOfDay(dateTime), 3);
    const currentPoint = differenceInMinutes(dateTime, dayStart);
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    const sizeWorkingDayInMinutes = MINS_IN_DAY - (MINS_IN_DAY - toInMinutes) - fromInMinutes;
    const ratio = sizeWorkingDayInMinutes/MINS_IN_DAY;
    const newPoint = Math.round((currentPoint)*ratio);
    const resultOffset = fromInMinutes + newPoint;

    return addMinutes(dayStart, resultOffset)
}

function notifyTimes(date1: Date, date2: Date, notifyCount: number): Date[] {
    const diffInMinutes = differenceInMinutes(date2, date1);

    let resultArr = [];
    const notifyOffset = diffInMinutes/notifyCount;
    let offset = diffInMinutes;

    for (let index = 0; index < notifyCount; index++) {
        const notifyLeft = notifyCount - index;
        offset -= notifyOffset*((notifyCount/2)/(notifyLeft*2));

        resultArr.push(addMinutes(date1, Math.round(offset)));
    }

    return resultArr.reverse();
}

function checkInWorkRange(from, to, dateTime) {
    const dayStart = addHours(startOfDay(dateTime), 3);
    const currentPoint = differenceInMinutes(dateTime, dayStart);
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    return currentPoint >= fromInMinutes && currentPoint <= toInMinutes;
}

function notifyTimesInNearDayWithWorkingHours(notifyTimes, from, to) {
    console.log(notifyTimes)
    // @ts-ignore
    const nearestDay = format(notifyTimes[0], DATE_FORMAT, dateFnsConfig);
    // @ts-ignore
    let notifiesInNearestDay = notifyTimes.filter( date => format(date, DATE_FORMAT, dateFnsConfig) === nearestDay );

    const allNotifiesInRange = notifiesInNearestDay.reduce( (value, date) => { value = checkInWorkRange(from, to, date); return value }, false)

    const offsets = !allNotifiesInRange
        ? notifiesInNearestDay.map( date => getAvailableTime(from, to, date))
        : notifiesInNearestDay;

    return offsets;
}

export function getNextNotifyTime(user, task): { date: string, time: string } {
    const taskTime = parse(`${task.date} ${task.time}`, `${DATE_FORMAT} ${TIME_FORMAT}`, new Date());

    const dateNow = new Date();
    const nextNotificationsTimes = notifyTimes(dateNow, taskTime, task.notificationsNeed).slice(task.notificationsDone);
    console.log(nextNotificationsTimes)
    const nextNotifyTime = notifyTimesInNearDayWithWorkingHours(nextNotificationsTimes, user.time_from, user.time_to)[0];
    const nextNotifyDateFormatted = format(subHours(nextNotifyTime, 3), DATE_FORMAT);
    const nextNotifyTimeFormatted = format(subHours(nextNotifyTime, 3), TIME_FORMAT);

    return { date: nextNotifyDateFormatted, time: nextNotifyTimeFormatted };
}

