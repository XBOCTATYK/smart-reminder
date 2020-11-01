import addMilliseconds from 'date-fns/addMilliseconds';
import addSeconds from 'date-fns/addSeconds';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfDay from 'date-fns/startOfDay';

import { DATE_FNS_OPTIONS, DateFnsOptions } from 'Constants/formats';

/**
 * Расширенный класс для работы с датами. Связка date-fns с приложением.
 */
export class ExtendedDate {
    value: Date = null;
    options: DateFnsOptions = DATE_FNS_OPTIONS;

    static of(date, format?, options = DATE_FNS_OPTIONS) {
        if (date instanceof ExtendedDate) {
            return date;
        }

        const newDate = new ExtendedDate(date);

        if (newDate.toString() === 'Invalid Date') {
            return new ExtendedDate(ExtendedDate.parse(date, format, options))
        }
    }

    constructor(date, format?, options = DATE_FNS_OPTIONS) {
        this.value = new Date(date);
        this.options = options;
    }

    private static parse(value: string, format: string, options: DateFnsOptions) {
        return parse(value, format, 0, options)
    }

    addMilliseconds(amount: number) {
        return ExtendedDate.of(addMilliseconds(this.value, amount))
    }

    addSeconds(amount: number) {
        return ExtendedDate.of(addSeconds(this.value, amount))
    }

    addMinutes(amount: number) {
        return ExtendedDate.of(addMinutes(this.value, amount))
    }

    addHours(amount: number) {
        return ExtendedDate.of(addHours(this.value, amount))
    }

    addDays(amount: number) {
        return ExtendedDate.of(addDays(this.value, amount))
    }

    addMonths(amount: number) {
        return ExtendedDate.of(addMonths(this.value, amount))
    }

    addYears(amount: number) {
        return ExtendedDate.of(addYears(this.value, amount))
    }

    startOfDay() {
        return ExtendedDate.of(startOfDay(this.value))
    }

    format(formatStr: string) {
        return format(this.value, formatStr, this.options)
    }

    get() {
        return new Date(this.value);
    }

    difference(date) {
        return ExtendedDate.of(ExtendedDate.of(this.value), ExtendedDate.of(date))
    }

    valueOf() {
        return this.value.getTime();
    }
}
