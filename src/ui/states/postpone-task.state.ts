import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class PostponeTaskState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Задача успешно создана!');
        return '';
    }

    onLeave(): string {
        return '';
    }

}
