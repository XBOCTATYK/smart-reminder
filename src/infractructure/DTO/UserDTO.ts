import { DTOError } from '../../domain/errors';
import { ICheckRequired } from 'Src/infractructure/interfaces/main';
import { Required } from 'Src/infractructure/decorators/validators/Required';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';
import { SkipNullableSetter } from 'Src/infractructure/decorators/methods/skipNullableSetter';

interface IUserDTO {
    id: number;
    startTime?: Date;
    endTime?: Date;
    timezone?: string;
    dontDisturbTimes?: Array<{ from: Date, to: Date }>;
    active: boolean;
}

export class UserDTO implements IUserDTO, ICheckRequired {
    @Required id: number;
    @Required @DateType startTime: Date;
    @Required @DateType endTime: Date;
    timezone: string = '0';
    dontDisturbTimes?: Array<{ from: Date, to: Date }>
    @Required active: boolean;

    constructor(data: IUserDTO) {
        this.setId(data.id);
        this.setStartTime(data.startTime);
        this.setEndTime(data.endTime);
        this.setTimezone(data.timezone);
        this.setDontDisturbTimes(data.dontDisturbTimes);
        this.setActive(data.active)
    }

    private isInvalidDate(time: Date): Date {
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

        return this;
    }

    @SkipNullableSetter
    setStartTime(time?: Date) {
        this.startTime = this.isInvalidDate(time);

        return this;
    }

    @SkipNullableSetter
    setEndTime(time?: Date) {
        const validEndTime = this.isInvalidDate(time);

        if (validEndTime.getTime() < this.startTime.getTime()) {
            throw new DTOError('END_TIME_LESS_THAN_START')
        }

        this.endTime = validEndTime;

        return this;
    }

    @SkipNullableSetter
    setTimezone(timezone?: string) {
        this.timezone = timezone;

        return this;
    }

    setDontDisturbTimes(dates?: Array<{ from: Date, to: Date }>) {
        if (!dates) {
            this.dontDisturbTimes = [];
            return this;
        }

        this.dontDisturbTimes = dates.map( date => ({ from: this.isInvalidDate(date.from), to: this.isInvalidDate(date.to) }));

        return this;
    }

    setActive(isActive: boolean) {
        if (isActive === undefined || isActive === null) return;

        this.active = isActive;

        return this;
    }

    checkRequires(): boolean {
        return true;
    }

    checkConsistence() {
        return this.checkRequires();
    }
}
