import { Answer } from 'Constants/answers';
import { GeneratedId } from '../decorators/generated-id';
import { TaskDTO } from './TaskDTO';

interface INotificationsDTO {
    id?: string;
    date: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done: boolean;
}

@GeneratedId
export class NotificationsDTO implements INotificationsDTO {
    id: string;
    date: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done: boolean;

    constructor(data: INotificationsDTO) {

    }
}
