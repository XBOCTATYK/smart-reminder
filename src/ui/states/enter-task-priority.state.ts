import { Markup } from 'telegraf';

import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';
import { TASK_CREATING_ACTION } from '../../constants/callback-actions';

const templateMessage = `${TASK_CREATING_ACTION}`;

export class EnterTaskPriorityState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return Markup.inlineKeyboard([
            Markup.callbackButton('2', `${templateMessage}/2`),
            Markup.callbackButton('4', `${templateMessage}/4`),
            Markup.callbackButton('6', `${templateMessage}/6`),
            Markup.callbackButton('8', `${templateMessage}/8`),
            Markup.callbackButton('10', `${templateMessage}/10`),
        ])
            .extra()
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage('Какой приоритет у задачи?');
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {

    }

}
