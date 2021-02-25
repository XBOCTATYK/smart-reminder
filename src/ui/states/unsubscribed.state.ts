import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class UnsubscribedState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Вы больше не получаете напоминания! Их можно включить кнопкой "Включить напоминания"')
        return '';
    }

    onLeave(): string {
        return '';
    }

}
