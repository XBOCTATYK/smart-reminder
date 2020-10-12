import parse from 'date-fns/parse';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import addMinutes from 'date-fns/addMinutes';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import { DATE_FNS_OPTIONS, DATE_FORMAT, TIME_FORMAT } from 'Src/constants/formats';

const MINS_IN_DAY = 1440;

function getRange(from: string, to: string): { fromInMinutes: number, toInMinutes: number } {
    const fromTime = parse(from, TIME_FORMAT, new Date(1970, 1, 2), DATE_FNS_OPTIONS);
    const toTime = parse(to, TIME_FORMAT, new Date(1970, 1, 2), DATE_FNS_OPTIONS);

    const fromInMinutes = differenceInMinutes(fromTime, startOfDay(fromTime));
    const toInMinutes = differenceInMinutes(toTime, startOfDay(fromTime));

    return { fromInMinutes, toInMinutes}
}

function getAvailableTime(from: string, to: string, dateTime: Date): Date {
    console.log(from, to, dateTime)
    const dayStart = startOfDay(dateTime);
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

function checkInWorkRange(from: string, to: string, dateTime: Date): boolean {
    console.log(from, to, dateTime)
    const dayStart = startOfDay(dateTime);
    const currentPoint = differenceInMinutes(dateTime, dayStart);
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    return currentPoint >= fromInMinutes && currentPoint <= toInMinutes;
}

function notifyTimesInNearDayWithWorkingHours(notifyTimes: Date[], from: string, to: string): Date[] {
    const nearestDay = format(notifyTimes[0], DATE_FORMAT, DATE_FNS_OPTIONS);
    let notifiesInNearestDay = notifyTimes.filter( date => format(date, DATE_FORMAT, DATE_FNS_OPTIONS) === nearestDay );

    const allNotifiesInRange = notifiesInNearestDay.reduce( (value, date) => { value = checkInWorkRange(from, to, date); return value }, false)

    const offsets = !allNotifiesInRange
        ? notifiesInNearestDay.map( date => getAvailableTime(from, to, date))
        : notifiesInNearestDay;

    return offsets;
}

export function getNextNotifyTime(user, task): { date: string, time: string } {
    const taskTime = parse(`${task.date} ${task.time}`, `${DATE_FORMAT} ${TIME_FORMAT}`, new Date(), DATE_FNS_OPTIONS);

    const dateNow = new Date();
    const nextNotificationsTimes = notifyTimes(dateNow, taskTime, task.notificationsNeed).slice(task.notificationsDone);
    console.log(nextNotificationsTimes)
    const nextNotifyTime = notifyTimesInNearDayWithWorkingHours(nextNotificationsTimes, user.time_from, user.time_to)[0];
    const nextNotifyDateFormatted = format(nextNotifyTime,  DATE_FORMAT, DATE_FNS_OPTIONS);
    const nextNotifyTimeFormatted = format(nextNotifyTime, TIME_FORMAT, DATE_FNS_OPTIONS);

    return { date: nextNotifyDateFormatted, time: nextNotifyTimeFormatted };
}

