import { GeneratedId } from '../decorators/generated-id';
import { Required } from '../decorators/validators/Required';
import { DateType } from '../decorators/validators/DateType';
import { NumberType } from '../decorators/validators/NumberType';

interface IUsualDTO {
    id?: string;
    lastTaskDate?: Date;
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    done?: boolean;
}

@GeneratedId
export class UsualDTO implements IUsualDTO {
    @Required id: string;
    @Required @DateType lastTaskDate: Date;
    @NumberType years: number = 0;
    @NumberType months: number = 0;
    @NumberType days: number = 0;
    @NumberType hours: number = 0;
    @NumberType minutes: number = 0;
    @Required done: boolean;

    constructor(data: IUsualDTO) {
        this.setLastTaskDate(data.lastTaskDate);
        this.setYears(data.years);
        this.setMonths(data.months);
        this.setDays(data.days);
        this.setHours(data.hours);
        this.setMinutes(data.minutes);
        this.setDone(data.done);
    }

    setLastTaskDate(date?: Date) {
        if (!date) return ;

        this.lastTaskDate = date;
    }

    setYears(years?: number) {
        if (!years) return ;

        this.years = years;
    }

    setMonths(months?: number) {
        if (!months) return ;

        this.months = months;
    }
    setDays(days?: number) {
        if (!days) return ;

        this.days = days;
    }

    setHours(hours?: number) {
        if (!hours) return ;

        this.hours = hours;
    }

    setMinutes(minutes?: number) {
        if (!minutes) return ;

        this.minutes = minutes;
    }

    setDone(done?: boolean) {
        if (done === undefined || done === null) return ;

        this.done = done;
    }
}
