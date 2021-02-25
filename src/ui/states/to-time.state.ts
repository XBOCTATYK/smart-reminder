import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class ToTimeState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        this.context.telegram.sendMessage('В какое время прекращать давать напоминания?');
        return '';
    }

    onLeave(): string {
        return '';
    }

}
