import { ExtendedDate } from '../../utils/date-services/extended-date';

export class Time {
    date: ExtendedDate;

    static of(dateObj) {
        return new Time(dateObj);
    }

    constructor(dateObj: Date | ExtendedDate) {
        this.date = ExtendedDate.of(ExtendedDate);
    }

    addMinutes(amount: number) {
        return Time.of(this.date.addMinutes(amount))
    }

    addHours(amount: number) {
        return Time.of(this.date.addDays(amount))
    }
}
