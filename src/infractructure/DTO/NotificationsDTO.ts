import { Answer } from 'Constants/answers';
import { GeneratedId } from '../decorators/generated-id';

interface INotificationsDTO {
    id?: string;
    date: Date;
    answer?: Answer;
    done: boolean;
}

@GeneratedId
export class NotificationsDTO implements INotificationsDTO {
    id: string;
    date: Date;
    answer?: Answer;
    done: boolean;

    constructor(data: INotificationsDTO) {

    }
}
