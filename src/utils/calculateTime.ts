import parse from 'date-fns/parse';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';

export function getAvailableTime(from, to, dateTime: Date) {
    const currentPoint = dateTime.getTime();
    const fromTime = parse(from, 'HH:mm', new Date(1970, 1, 2));
    const toTime = parse(to, 'HH:mm', new Date(1970, 1, 3));


}

function notifyTimes(date1: Date, date2: Date, notifyCount: number): Date[] {
    const diffInMinutes = differenceInMinutes(date2, date1);

    let resultArr = [];
    let altArr = [];
    const notifyOffset = diffInMinutes/notifyCount;
    let offset = diffInMinutes;

    for (let index = 0; index < notifyCount; index++) {
        const notifyLeft = notifyCount - index;
        offset -= notifyOffset*((notifyCount/2)/(notifyLeft*2));

        resultArr.push(addMinutes(date1, Math.round(offset)), 'dd.MM.yyyy HH:mm');
    }

    return resultArr.reverse();
}

export function notifyTimesInNearDayWithWorkingHours(notifyTimes: Date[], from, to): Date[] {
    const nearestDay = notifyTimes[0].toLocaleString();
    const notifyInNearestDay = notifyTimes.filter( date => date.toLocaleString() === nearestDay )
}

export function calculateTime(user, task) {
    const taskTime = parse(`${task.date} ${task.time}`, 'dd.MM.yyyy HH:mm', new Date());

    const notificationsLeft = task.notificationsNeed - task.notificationsDone;
    const dateNow = new Date();
    const nextNotificationsTimes = notifyTimes(dateNow, taskTime, notificationsLeft);
    const nextNotifyTime = nextNotificationsTimes[nextNotificationsTimes.length - 1];


}

