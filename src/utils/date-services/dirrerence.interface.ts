import { IExtendedDate } from './extended-date.interface';

export interface IDifference {
    from: IExtendedDate;
    to: IExtendedDate;
    diff: number;

    inMinutes(): number;

    inHours(): number;

    inDays(): number;

    inMonths(): number;

    inYears(): number;

    addMilliseconds(amount: number): IDifference

    addSeconds(amount: number): IDifference

    addMinutes(amount: number): IDifference

    addHours(amount: number): IDifference

    addDays(amount: number): IDifference

    addMonths(amount: number): IDifference

    addYears(amount: number): IDifference

    intersection(diffObj: IDifference): IDifference

    union(diffObj: IDifference): IDifference

    dateFrom(): IExtendedDate

    dateTo(): IExtendedDate

    get(): Date

    valueOf(): number
}
