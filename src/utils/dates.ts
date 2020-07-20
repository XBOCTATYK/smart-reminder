import { DATE_FNS_OPTIONS, DATE_FORMAT } from 'Constants/formats';
import { addDays } from 'date-fns';
import format from 'date-fns/format';

export function getDateNow() {
    return format(new Date(), DATE_FORMAT, DATE_FNS_OPTIONS);
}

export function getDateTomorrow() {
    return format(addDays(new Date(), 1), DATE_FORMAT, DATE_FNS_OPTIONS);
}
