import parse from 'date-fns/parse';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';


const dateFnsConfig = { weekStartsOn: 1 };

const MINS_IN_DAY = 1440;

function getRange(from, to) {
    const fromTime = parse(from, 'HH:mm', new Date(1970, 1, 2));
    const toTime = parse(to, 'HH:mm', new Date(1970, 1, 2));

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

        resultArr.push(addMinutes(date1, Math.round(offset)), 'dd.MM.yyyy HH:mm');
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
    // @ts-ignore
    const nearestDay = format(notifyTimes[0], 'dd.MM.yyyy', dateFnsConfig);
    // @ts-ignore
    let notifiesInNearestDay = notifyTimes.filter( date => format(date, 'dd.MM.yyyy', dateFnsConfig) === nearestDay );

    const allNotifiesInRange = notifiesInNearestDay.reduce( (value, date) => { value = checkInWorkRange(from, to, date); return value }, false)

    const offsets = !allNotifiesInRange
        ? notifiesInNearestDay.map( date => getAvailableTime(from, to, date))
        : notifiesInNearestDay;

    return offsets;
}

export function calculateTime(user, task): [string, string] {
    const taskTime = parse(`${task.date} ${task.time}`, 'dd.MM.yyyy HH:mm', new Date());

    const notificationsLeft = task.notificationsNeed - task.notificationsDone;
    const dateNow = new Date();
    const nextNotificationsTimes = notifyTimes(dateNow, taskTime, task.notificationsNeed).slice(task.notificationsDone);
    const nextNotifyTime = notifyTimesInNearDayWithWorkingHours(user.time_from, user.time_to, nextNotificationsTimes)[0];

    return nextNotifyTime;
}

