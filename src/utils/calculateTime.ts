import differenceInMinutes from 'date-fns/differenceInMinutes';
import addMinutes from 'date-fns/addMinutes';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import { DATE_FNS_OPTIONS, DATE_FORMAT } from 'Src/constants/formats';
import { Task } from 'Src/domain/entities/Task';
import { User } from 'Src/domain/entities/User';

const MINS_IN_DAY = 1440;

function getRange(fromTime: Date, toTime: Date): { fromInMinutes: number, toInMinutes: number } {
    const fromInMinutes = differenceInMinutes(fromTime, startOfDay(fromTime));
    const toInMinutes = differenceInMinutes(toTime, startOfDay(fromTime));

    return { fromInMinutes, toInMinutes}
}

function getAvailableTime(from: Date, to: Date, dateTime: Date): Date {
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

function checkInWorkRange(from: Date, to: Date, dateTime: Date): boolean {
    const dayStart = startOfDay(dateTime);
    const currentPoint = differenceInMinutes(dateTime, dayStart);
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    return currentPoint >= fromInMinutes && currentPoint <= toInMinutes;
}

function notifyTimesInNearDayWithWorkingHours(notifyTimes: Date[], from: Date, to: Date): Date[] {
    const nearestDay = format(notifyTimes[0], DATE_FORMAT, DATE_FNS_OPTIONS);
    let notifiesInNearestDay = notifyTimes.filter( date => format(date, DATE_FORMAT, DATE_FNS_OPTIONS) === nearestDay );

    const allNotifiesInRange = notifiesInNearestDay.reduce( (value, date) => { value = checkInWorkRange(from, to, date); return value }, false)

    const offsets = !allNotifiesInRange
        ? notifiesInNearestDay.map( date => getAvailableTime(from, to, date))
        : notifiesInNearestDay;

    return offsets;
}

export function getNextNotifyTime(user: User, task: Task): Date {
    const dateNow = new Date();
    const nextNotificationsTimes = notifyTimes(dateNow, task.date, task.notificationsNeed).slice(task.notificationsDone);
    console.log(nextNotificationsTimes)

    return notifyTimesInNearDayWithWorkingHours(nextNotificationsTimes, user.startTime, user.endTime)[0];
}

