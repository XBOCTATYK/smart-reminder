import { IUIState } from '../ui-interfaces';

import { Shape } from 'Types/shape';

export class PendingTaskState<CTX> implements IUIState {
    name;
    context;

    constructor(context?: CTX) {
        this.context = context;
    }
    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        this.context.reply('Воспользуйтесь панелью управления, чтобы добавить задачу')
        return '';
    }

    onLeave(): string {
        return '';
    }

}
