import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class EnterTaskDateState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return undefined;
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Введите дату задачи');
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
