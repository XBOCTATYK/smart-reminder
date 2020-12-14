import { DTOError } from '../../domain/errors';
import { ICheckRequired } from 'Src/infractructure/interfaces/main';
import { Required } from 'Src/infractructure/decorators/validators/Required';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';

interface IUserDTO {
    id: number;
    startTime?: Date;
    endTime?: Date;
    timezone?: string;
    dontDisturbTimes?: Array<{ from: Date, to: Date }>
}

export class UserDTO implements IUserDTO, ICheckRequired {
    @Required id: number;
    @Required @DateType startTime: Date;
    @Required @DateType endTime: Date;
    timezone: string = '0';
    @Required dontDisturbTimes?: Array<{ from: Date, to: Date }>

    checkRequires(): boolean {
        return true;
    }

    constructor(data: IUserDTO) {
        this.setId(data.id);
        this.setStartTime(data.startTime);
        this.setEndTime(data.endTime);
        this.setTimezone(data.timezone);
        this.setDontDisturbTimes(data.dontDisturbTimes);
    }

    private isInvalidDate(time: any) {
        const isDate = time instanceof Date;

        if (!isDate || time.toString() === 'Invalid Date') {
            throw new DTOError('START_TIME_WRONG_FORMAT')
        }

        return time;
    }

    setId(id?: number) {
        if (!id) {
            throw new DTOError('EMPTY_USER_ID');
        }

        this.id = id;
    }

    setStartTime(time?: Date) {
        if (!time) return;

        this.startTime = this.isInvalidDate(time);
    }

    setEndTime(time?: Date) {
        if (!time) return;

        const validEndTime = this.isInvalidDate(time);

        if (validEndTime.getTime < this.startTime.getTime()) {
            throw new DTOError('END_TIME_LESS_THAN_START')
        }

        this.endTime = validEndTime;
    }

    setTimezone(timezone?: string) {
        if (!timezone) return;

        this.timezone = timezone;
    }

    setDontDisturbTimes(dates?: Array<{ from: Date, to: Date }>) {
        if (!dates) {
            this.dontDisturbTimes = [];
            return;
        }

        this.dontDisturbTimes = dates.map( date => ({ from: this.isInvalidDate(date.from), to: this.isInvalidDate(date.to) }))
    }
}
