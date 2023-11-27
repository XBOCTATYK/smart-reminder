import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';
import { Markup } from 'telegraf';
import { TASK_CREATING_ACTION } from '../../constants/callback-actions';

const templateMessage = `${TASK_CREATING_ACTION}`;

export class EnterTaskDateState implements IUIState {
    context: any;
    name: string;

    controls(): Shape<any> {
        return Markup.inlineKeyboard([
            Markup.callbackButton('Сегодня', `${templateMessage}/TODAY`),
            Markup.callbackButton('Завтра', `${templateMessage}/TOMORROW`),
            Markup.callbackButton('Повторяющееся событие', `${templateMessage}/REPEAT`),
        ])
            .extra()
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

    onError(err: Error): any {
    }

}
