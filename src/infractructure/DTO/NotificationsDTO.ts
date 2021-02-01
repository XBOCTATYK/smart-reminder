import { Answer, ANSWERS } from 'Constants/answers';
import { GeneratedId } from 'Decorators/generated-id';
import { OneOf } from 'Decorators/validators/OneOf';
import { Required } from 'Decorators/validators/Required';
import { DTO } from 'Decorators/validators/DTO';
import { DateType } from 'Decorators/validators/DateType';
import { SkipNullableSetter } from 'Decorators/methods/skipNullableSetter';
import { TaskDTO } from 'DTO/TaskDTO';
import { DTO_ERROR } from 'Constants/errors';
import { DTOError } from 'Domain/errors';

import { ICheckRequired, IConsistent } from 'Src/infractructure/interfaces/main';

interface INotificationsDTO {
    id?: string;
    date?: Date;
    answer?: Answer;
    Task?: TaskDTO;
    done?: boolean;
}

const ANSWERS_CASES = Object.keys(ANSWERS);

@GeneratedId
export class NotificationsDTO implements INotificationsDTO, IConsistent, ICheckRequired {
    @Required id: string;
    @Required @DateType date: Date;
    @Required @OneOf(ANSWERS_CASES) answer?: Answer;
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
            throw new DTOError(DTO_ERROR.WRONG_ANSWER)
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
