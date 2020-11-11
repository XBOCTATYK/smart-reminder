interface IUserDTO {
    id: number;
    startTime: Date;
    endTime: Date;
    timezone: string;
    dontDisturbTimes?: Array<{ from: Date, to: Date }>
}

export class UserDTO implements IUserDTO {
    id: number;
    startTime: Date;
    endTime: Date;
    timezone: string;
    dontDisturbTimes?: Array<{ from: Date, to: Date }>

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
            throw new Error('START_TIME_WRONG_FORMAT')
        }

        return time;
    }

    setId(id: number) {
        if (!id) {
            throw new Error('EMPTY_USER_ID');
        }

        this.id = id;
    }

    setStartTime(time: Date) {
        this.startTime = this.isInvalidDate(time);
    }

    setEndTime(time: Date) {
        const validEndTime = this.isInvalidDate(time);

        if (validEndTime.getTime < this.startTime.getTime()) {
            throw new Error('END_TIME_LESS_THAN_START')
        }

        this.endTime = validEndTime;
    }

    setTimezone(timezone?: string) {
        if (!timezone) return;

        this.timezone = timezone;
    }

    setDontDisturbTimes(dates: Array<{ from: Date, to: Date }>) {
        if (!dates) {
            this.dontDisturbTimes = [];
            return;
        }

        this.dontDisturbTimes = dates.map( date => ({ from: this.isInvalidDate(date.from), to: this.isInvalidDate(date.to) }))
    }
}