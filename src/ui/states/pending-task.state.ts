import { IUIState } from '../ui-interfaces';

import { Shape } from 'Types/shape';

export class PendingTaskState<CTX = any> implements IUIState {
    name;
    context;

    constructor(name: string, context?: CTX) {
        this.name = name;
        this.context = context;
    }
    controls(): Shape<any> {
        return undefined;
    }

    interact(): string {
        return '';
    }

    onEnter(): string {
        return '';
    }

    onLeave(): string {
        return '';
    }

}
