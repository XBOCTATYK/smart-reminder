import { IUIState } from '../ui-interfaces';

export class PendingTaskState<CTX> implements IUIState {
    id;
    name;
    context;

    constructor(context?: CTX) {
        this.context = context;
    }
    controls(): any {
        return undefined;
    }

    interact(): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.context.telegram.sendMessage(this.id, 'Воспользуйтесь панелью управления, чтобы добавить задачу', this.controls())
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {
        return undefined;
    }

}
