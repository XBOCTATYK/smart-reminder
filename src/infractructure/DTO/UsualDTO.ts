import { GeneratedId } from '../decorators/generated-id';
import { Required } from '../decorators/validators/Required';
import { DateType } from '../decorators/validators/DateType';
import { NumberType } from '../decorators/validators/NumberType';
import { DTO } from '../decorators/validators/DTO';
import { TaskDTO } from './TaskDTO';
import { SkipNullableSetter } from '../decorators/methods/skipNullableSetter';

interface IUsualDTO {
    id?: string;
    task_id?: string;
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
    @Required task_id: string;
    @DTO Task: TaskDTO;
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
        this.setTaskId(data.task_id);
    }k

    @SkipNullableSetter
    setTaskId(id?: string) {
        this.task_id = id;

        return this;
    }

    @SkipNullableSetter
    setLastTaskDate(date?: Date) {
        this.lastTaskDate = date;

        return this;
    }

    @SkipNullableSetter
    setYears(years?: number) {
        this.years = years;

        return this;
    }

    @SkipNullableSetter
    setMonths(months?: number) {
        this.months = months;

        return this;
    }

    @SkipNullableSetter
    setDays(days?: number) {
        this.days = days;

        return this;
    }

    @SkipNullableSetter
    setHours(hours?: number) {
        this.hours = hours;

        return this;
    }

    @SkipNullableSetter
    setMinutes(minutes?: number) {
        this.minutes = minutes;

        return this;
    }

    setDone(done?: boolean) {
        if (done === undefined || done === null) return ;

        this.done = done;

        return this;
    }

    @SkipNullableSetter
    setTask(task?: TaskDTO) {
        this.Task = task;

        return this;
    }
}
