import { DateFnsOptions } from '../../constants/formats';
import { Difference } from './difference';

export interface IExtendedDate {
    constructor(date: Date | IExtendedDate, format?, options?: DateFnsOptions)

    addMilliseconds(amount: number): IExtendedDate

    addSeconds(amount: number): IExtendedDate

    addMinutes(amount: number): IExtendedDate

    addHours(amount: number): IExtendedDate

    addDays(amount: number): IExtendedDate

    addMonths(amount: number): IExtendedDate

    addYears(amount: number): IExtendedDate

    startOfDay(): IExtendedDate

    format(formatStr: string): string

    get(): Date

    difference(date): Difference

    valueOf(): number
}
