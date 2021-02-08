import { IUIState } from '../ui-interfaces';

import { Shape } from 'Types/shape';

export class PendingTaskState implements IUIState {
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
