import { Answer, ANSWERS } from 'Constants/answers';
import { GeneratedId } from '../decorators/generated-id';
import { TaskDTO } from './TaskDTO';
import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';
import { Required } from 'Src/infractructure/decorators/validators/Required';
import { DTO } from 'Src/infractructure/decorators/validators/DTO';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';
import { DTOError } from 'Src/domain/errors';
import { SkipNullableSetter } from 'Src/infractructure/decorators/methods/skipNullableSetter';

interface INotificationsDTO {
    id?: string;
    date?: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done?: boolean;
}

@GeneratedId
export class NotificationsDTO implements INotificationsDTO, IConsistent, ICheckRequired {
    @Required id: string;
    @Required @DateType date: Date;
    @Required answer?: Answer;
    @Required @DTO Task?: TaskDTO;
    @Required done: boolean;

    constructor(data: INotificationsDTO = {}) {
        this.setDate(data.date);
        this.setDone(data.done);
        this.setAnswer(data.answer);
        this.setTask(data.Task);
    }

    @SkipNullableSetter
    setAnswer(answer: Answer) {
        const arrAnswers = Object.values(ANSWERS);

        if (!arrAnswers.includes(answer)) {
            throw new DTOError(`WRONG_ANSWER`)
        }
        this.answer = answer;

        return this;
    }

    @SkipNullableSetter
    setDate(date?: Date) {
        this.date = date;

        return this;
    }

    setDone(isDone?: boolean) {
        if (isDone ?? true) return ;

        this.done = isDone;

        return this;
    }

    @SkipNullableSetter
    setTask(task?: TaskDTO) {
        this.Task = task;

        return this;
    }

    checkRequires(): boolean {
        return true;
    }

    checkConsistence(): boolean {
        return this.checkRequires();
    }
}
