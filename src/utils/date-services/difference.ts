import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInYears from 'date-fns/differenceInYears';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import { ExtendedDate } from './extended-date';

export class Difference {
    from: ExtendedDate;
    to: ExtendedDate;
    diff: number;

    static of(date1, date2) {
        if (!date2) {
            if (date1 instanceof Difference) {
                return date1;
            }

            return new Difference(date1);
        }

        return new Difference(date1, date2);
    }

    constructor(date1, date2?) {
        if (!date1) {
            this.from = ExtendedDate.of(0);
            this.to = ExtendedDate.of(0);
        }

        if (!date2) {
            this.from = ExtendedDate.of(0);
            this.to = ExtendedDate.of(date1);
        }

        this.from = ExtendedDate.of(date1);
        this.to = ExtendedDate.of(date2);

        // Swap values if right date rather than left
        if (this.to < this.from) {
            const temp = this.to;

            this.to = this.from;
            this.from = temp;
        }

        this.diff = differenceInMilliseconds(this.from.get(), this.to.get());
    }

    inMinutes() {
        return differenceInMinutes(this.from.get(), this.to.get());
    }

    inHours() {
        return differenceInHours(this.from.get(), this.to.get());
    }

    inDays() {
        return differenceInDays(this.from.get(), this.to.get());
    }

    inMonth() {
        return differenceInMonths(this.from.get(), this.to.get());
    }

    inYears() {
        return differenceInYears(this.from.get(), this.to.get());
    }

    get() {
        return new Date(this.diff);
    }

    addMilliseconds(amount: number) {
        this.to = this.to.addMilliseconds(amount);
        return this;
    }

    addSeconds(amount: number) {
        this.to = this.to.addSeconds(amount);
        return this;
    }

    addMinutes(amount: number) {
        this.to = this.to.addMinutes(amount);
        return this;
    }

    addHours(amount: number) {
        this.to = this.to.addHours(amount);
        return this;
    }

    addDays(amount: number) {
        this.to = this.to.addDays(amount);
        return this;
    }

    addMonths(amount: number) {
        this.to = this.to.addMonths(amount);
        return this;
    }

    addYears(amount: number) {
        this.to = this.to.addYears(amount);
        return this;
    }

    dateFrom() {
        return ExtendedDate.of(this.from);
    }

    dateTo() {
        return ExtendedDate.of(this.to);
    }

    intersection(diffObj: Difference) {
        let dateTo = null;
        let dateFrom = null;

        if (diffObj.dateFrom() > this.dateFrom()) {
            dateFrom = diffObj.dateFrom();
        } else {
            dateFrom = this.dateFrom();
        }

        if (diffObj.dateTo() < this.dateTo()) {
            dateTo = diffObj.dateTo();
        } else {
            dateTo = this.dateTo();
        }

        return Difference.of(dateFrom, dateTo);
    }

    union(diffObj: Difference) {
        let dateTo = null;
        let dateFrom = null;

        if (diffObj.dateFrom() > this.dateFrom()) {
            dateFrom = diffObj.dateFrom();
        } else {
            dateFrom = this.dateFrom();
        }

        if (diffObj.dateTo() < this.dateTo()) {
            dateTo = diffObj.dateTo();
        } else {
            dateTo = this.dateTo();
        }

        return Difference.of(dateFrom, dateTo);
    }
}
