import { IUIState } from '../ui-interfaces';
import { Shape } from '../../types/shape';

export class StartState implements IUIState {
    tgContext: any;
    name: string;
    appContext: any;
    userContext: any;
    textToDataModifier: Function;

    constructor(stateMachine: any, appContext?: any, tgContext?: any ) {
        this.tgContext = tgContext;
        this.appContext = appContext;
    }

    controls(): Shape<any> {
        return undefined;
    }

    async interact(tgContext): Promise<boolean> {
        this.userContext.setData({ startTime: this.textToDataModifier(string) })
        return Promise.resolve(true);
    }

    onEnter(): string {
        this.tgContext.reply('С какого времени вам нужно начинать напоминать?')
        return '';
    }

    onLeave(): string {
        return '';
    }

    onError(err: Error): any {
    }

    of() {

    }
}
