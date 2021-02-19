import { IUIState } from './ui-interfaces';

export interface IStateMachine {
    stateMachine;
    defaultState: IUIState;
    state: IUIState;
    prevState: IUIState;

    init(state: IUIState): IStateMachine;
    next(state: IUIState): IStateMachine;
    prev(): IStateMachine;
    default(): IStateMachine;
    interact(context): IStateMachine;
}
