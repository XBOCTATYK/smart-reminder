import { Answer, ANSWERS } from '../../constants/answers';
import { ExtendedDate } from '../../utils/date-services/extended-date';
import { BusinessError } from '../errors';

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
            throw new BusinessError('UNRECOGNIZED_ANSWER')
        }

        if (answer !== ANSWERS.WAITING) {
            throw new BusinessError('ANSWER_IS_SETTED')
        }

        this.answer = answer;
        this.setDone();
    }
}
