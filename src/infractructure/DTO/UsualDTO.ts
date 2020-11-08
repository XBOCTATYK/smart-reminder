import { GeneratedId } from '../decorators/generated-id';

interface IUsualDTO {
    id?: string;
    lastTaskDate: Date;
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    done: boolean;
}

@GeneratedId
export class UsualDTO implements IUsualDTO {
    id: string;
    lastTaskDate: Date;
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    done: boolean;

    constructor(data: IUsualDTO) {

    }
}
