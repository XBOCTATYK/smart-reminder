import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';
import { Markup } from 'telegraf';
import { TASK_CREATING_ACTION } from '../../constants/callback-actions';

const templateMessage = `${TASK_CREATING_ACTION}`;

export class RepeatingTaskState implements IUIState {
    id: number;
    context: any;
    name: string;

    controls(): Shape<any> {
        return Markup.inlineKeyboard([
            Markup.callbackButton('Ежедневно', `${templateMessage}/DAILY`),
            Markup.callbackButton('Еженедельно', `${templateMessage}/WEEKLY`),
        ])
            .extra()
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage(this.id,'Запланируйте повторы задач.', this.controls());
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {
    }
}
