import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class FromTimeState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage('В какое время начинать делать напоминания?');
        return '';
    }

    onLeave(): string {
        return '';
    }

    onCallback(): any {
    }

    onError(err: Error): any {
    }

}
