import { Answer } from 'Constants/answers';
import { GeneratedId } from '../decorators/generated-id';
import { TaskDTO } from './TaskDTO';
import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';

interface INotificationsDTO {
    id?: string;
    date: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done: boolean;
}

@GeneratedId
export class NotificationsDTO implements INotificationsDTO, IConsistent, ICheckRequired {
    id: string;
    date: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done: boolean;

    constructor(data: INotificationsDTO) {

    }

    checkRequired(): boolean {
        return true;
    }

    checkConsistence(): boolean {
        return this.checkRequired();
    }
}
