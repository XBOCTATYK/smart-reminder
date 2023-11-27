import { IUIState } from '../ui-interfaces';

export class PendingTaskState<CTX> implements IUIState {
    id;
    name;
    tgContext;
    appContext;

    constructor(tgContext?: CTX, appContext?: any ) {
        this.tgContext = tgContext;
        this.appContext = appContext;
    }
    controls(): any {
        return undefined;
    }

    interact(string): Promise<boolean> {
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.tgContext.sendMessage(this.id, 'Воспользуйтесь панелью управления, чтобы добавить задачу', this.controls())
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {
        return undefined;
    }

}
