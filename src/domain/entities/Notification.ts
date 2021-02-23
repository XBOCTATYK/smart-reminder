import { Answer, ANSWERS } from 'Constants/answers';
import { BUSINESS_ERROR } from 'Constants/errors';
import { BusinessError } from 'Domain/errors';
import { ExtendedDate } from 'Utils/date-services/extended-date';

export class Notification {
    time: ExtendedDate;
    done: boolean;
    answer: Answer;

    constructor(time: Date) {
        this.time = new ExtendedDate(time);
        this.answer = ANSWERS.WAITING;
    }

    isDone() {
        return this.done;
    }

    setDone() {
        this.done = true;
    }

    setAnswer(answer: Answer) {
        if (!Object.values(ANSWERS).includes(answer)) {
            throw new BusinessError(BUSINESS_ERROR.UNRECOGNIZED_ANSWER)
        }

        if (answer !== ANSWERS.WAITING) {
            throw new BusinessError(BUSINESS_ERROR.ANSWER_IS_SETTED)
        }

        this.answer = answer;
        this.setDone();
    }

    toSerializable() {
        return {
            time: this.time.format('HH:mm'),
            done: this.done,
            answer: this.answer,
        }
    }
}
