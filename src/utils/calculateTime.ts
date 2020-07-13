import parse from 'date-fns/parse';

export function getAvailableTime(from, to, dateTime: Date) {
    const currentPoint = dateTime.getTime();
    const fromTime = parse(from, 'HH:mm', new Date(1970, 1, 2));
    const toTime = parse(to, 'HH:mm', new Date(1970, 1, 3));
}

export function notifiesInDay(days, notifications) {
    let result = [];
    let notificationsAll = notifications;

    for (let index = 0; index <= days; index++) {
        const diff = notificationsAll/days;
        const oneDayWeight = 1/days;

        const notifInDay = Math.floor(diff - oneDayWeight);

        result[index] = notifInDay;

        notificationsAll -= notifInDay;
    }

    return result;
}

export function calculateTime(user, task) {
    const taskTime = parse(`${task.date} ${task.time}`, 'dd.MM.yyyy HH:mm', new Date()).getTime();
    const timeDiff = taskTime - Date.now();
    //const userDayTime
}

