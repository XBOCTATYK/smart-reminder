import { Answer, ANSWERS } from 'Constants/answers';
import { GeneratedId } from '../decorators/generated-id';
import { TaskDTO } from './TaskDTO';
import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';
import { Required } from 'Src/infractructure/decorators/validators/Required';
import { DTO } from 'Src/infractructure/decorators/validators/DTO';
import { DateType } from 'Src/infractructure/decorators/validators/DateType';
import { DTOError } from 'Src/domain/errors';

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

    setAnswer(answer: Answer) {
        if (!answer) return ;

        const arrAnswers = Object.values(ANSWERS);

        if (!arrAnswers.includes(answer)) {
            throw new DTOError(`WRONG_ANSWER`)
        }
        this.answer = answer;

        return this;
    }

    setDate(date?: Date) {
        if (!date) return ;

        this.date = date;

        return this;
    }

    setDone(isDone?: boolean) {
        if (isDone === undefined || isDone === null) return ;

        this.done = isDone;

        return this;
    }

    setTask(task?: TaskDTO) {
        if (!task) return ;

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
