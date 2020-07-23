const differenceInMinutes = require('date-fns/differenceInMinutes')
const addMinutes = require('date-fns/addMinutes')
const addHours = require('date-fns/addHours');
const addDays = require('date-fns/addDays')
const format = require('date-fns/format')
const parse = require('date-fns/parse')
const startOfDay = require('date-fns/startOfDay')

const MINS_IN_DAY = 1440;

function getRange(from, to) {
    const fromTime = parse(from, 'HH:mm', new Date(1970, 1, 2), { locale: 'ru-Ru' });
    const toTime = parse(to, 'HH:mm', new Date(1970, 1, 2), { locale: 'ru-Ru' });

    const fromInMinutes = differenceInMinutes(fromTime, startOfDay(fromTime, { locale: 'ru-Ru' }));
    const toInMinutes = differenceInMinutes(toTime, startOfDay(fromTime, { locale: 'ru-Ru' }));

    return { fromInMinutes, toInMinutes}
}

function getAvailableTime(from, to, dateTime) {
    const dayStart = startOfDay(dateTime, { locale: 'ru-Ru' });
    const currentPoint = differenceInMinutes(dateTime, dayStart, { locale: 'ru-Ru' });
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    const sizeWorkingDayInMinutes = MINS_IN_DAY - (MINS_IN_DAY - toInMinutes) - fromInMinutes;
    const ratio = sizeWorkingDayInMinutes/MINS_IN_DAY;
    const newPoint = Math.round((currentPoint)*ratio);
    const resultOffset = fromInMinutes + newPoint;

    return addMinutes(dayStart, resultOffset, { locale: 'ru-Ru' })

}

function checkInWorkRange(from, to, dateTime) {
    const dayStart = startOfDay(dateTime, { locale: 'ru-Ru' });
    const currentPoint = differenceInMinutes(dateTime, dayStart, { locale: 'ru-Ru' });
    const { fromInMinutes, toInMinutes } = getRange(from, to);

    return currentPoint >= fromInMinutes && currentPoint <= toInMinutes;
}

function notifiesInDay(date1, date2, notifyCount) {
    const diffInMinutes = differenceInMinutes(date2, date1, { locale: 'ru-Ru' });

    let resultArr = [];
    const notifyOffset = diffInMinutes/notifyCount;
    let offset = diffInMinutes;

    for (let index = 0; index < notifyCount; index++) {
        const notifyLeft = notifyCount - index;
        offset -= notifyOffset*((notifyCount/2)/(notifyLeft*2));

        resultArr.push(addMinutes(date1, Math.round(offset), { locale: 'ru-Ru' }));
    }

    return resultArr.reverse();
}


const notifies = notifiesInDay(new Date(2020, 10, 15, 14, 27), new Date(2020, 10, 28, 22), 60);
console.log(notifies)
function notifyTimesInNearDayWithWorkingHours(notifyTimes, from, to) {
    const nearestDay = format(notifyTimes[0], 'dd.MM.yyyy', new Date(), { locale: 'ru-Ru' });
    let notifiesInNearestDay = notifyTimes.filter( date => format(date, 'dd.MM.yyyy', new Date(), { locale: 'ru-Ru' }) === nearestDay );

    const allNotifiesInRange = notifiesInNearestDay.reduce( (value, date) => { value = checkInWorkRange(from, to, date); return value }, false)

    const offsets = !allNotifiesInRange
        ? notifiesInNearestDay.map( date => getAvailableTime(from, to, date))
        : notifiesInNearestDay;

    return offsets[0];
}

notifyTimesInNearDayWithWorkingHours(notifies, '10:00', '22:00')

let currentNotifyDate = new Date(2020, 10, 15, 14, 27);
const startDate = currentNotifyDate;

for (let index = 0; index < 6; index++) {
    const not = notifiesInDay(startDate, new Date(2020, 10, 28, 18), 6).slice(index);
    currentNotifyDate = notifyTimesInNearDayWithWorkingHours(not, '10:00', '22:00');
    if (!checkInWorkRange('10:00', '22:00', currentNotifyDate)) {
        index++;
        const not2 = notifiesInDay(startDate, new Date(2020, 10, 28, 18), 6).slice(index);
        currentNotifyDate = notifyTimesInNearDayWithWorkingHours(not2, '10:00', '22:00');
    }
    console.log(currentNotifyDate);
}


class Notification {
    id;
    create() {}
    map() {}
    chain() {}
}

class NotificationsList {
    id;
    create() {}
    map() {}
    chain() {}
    add() {}
    remove() {}
}
