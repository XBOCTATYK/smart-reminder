import { IUIState } from '../ui-interfaces';
import { emptyFunc } from '../../utils/functions/empty-func';

import { Shape } from 'Types/shape';

const ERRORS = {

};

export class EnterTaskTimeState implements IUIState {
    context: any;
    name: string;

    protected controls(): Shape<any> {
        return undefined;
    }

    interact(input: string): Promise<boolean> {
        return this.context.saveTaskTime(input);
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Введите время задачи', this.controls());
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): void {
        const errorHandler = (ERRORS[err.message] || emptyFunc);
        errorHandler(this.context);
    }
}
