const differenceInMinutes = require('date-fns/differenceInMinutes')
const addMinutes = require('date-fns/addMinutes')
const format = require('date-fns/format')

function notifiesInDay(date1, date2, notifyCount) {
    const diffInMinutes = differenceInMinutes(date2, date1);

    let resultArr = [];
    let altArr = [];
    const notifyOffset = diffInMinutes/notifyCount;
    let offset = diffInMinutes;

    for (let index = 0; index < notifyCount; index++) {
        const notifyLeft = notifyCount - index;
        offset -= notifyOffset*((notifyCount/2)/(notifyLeft*2));

        resultArr.push(format(addMinutes(date1, Math.round(offset)), 'dd.MM.yyyy HH:mm'));
    }

    return resultArr.reverse();
}


console.log(notifiesInDay(new Date(2020, 10, 10), new Date(2020, 10, 28), 20));
