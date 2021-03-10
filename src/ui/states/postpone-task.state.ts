import { IUIState } from '../ui-interfaces';
import { POSTPONE_TASK } from '../../constants/callback-actions';
import { Markup } from 'telegraf';

export class PostponeTaskState implements IUIState {
    context: any;
    name: string;

    controls(): any {
        const templateMessage = `${ POSTPONE_TASK }/${ this.context.taskId }`;
        return Markup.inlineKeyboard([
            Markup.callbackButton('15 м', `${ templateMessage }/15.М`),
            Markup.callbackButton('30 м', `${ templateMessage }/30.М`),
            Markup.callbackButton('1 ч', `${ templateMessage }/1.H`),
            Markup.callbackButton('2 ч', `${ templateMessage }/2.H`),
            Markup.callbackButton('3 ч', `${ templateMessage }/3.H`),
            Markup.callbackButton('6 ч', `${ templateMessage }/6.H`),
            Markup.callbackButton('1 д', `${ templateMessage }/1.D`),
            Markup.callbackButton('2 д', `${ templateMessage }/2.D`),
        ]).extra()
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage(this.context.id, 'Задача успешно создана!', this.controls());
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {

    }

    onCallback(): any {

    }

}
