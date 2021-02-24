import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class EnterTaskPriorityState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Какой приоритет у задачи?');
        return '';
    }

    onLeave(): string {
        return '';
    }

}
