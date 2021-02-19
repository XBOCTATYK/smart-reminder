import { IUIState } from './ui-interfaces';

export interface IStateMachine {
    stateMachine;
    defaultState: IUIState;
    state: IUIState;
    prevState: IUIState;

    init(state: IUIState): IUIState;
    next(state: IUIState): IUIState;
    prev(): IUIState;
    default(): IUIState;
    interact(): IUIState;
}
