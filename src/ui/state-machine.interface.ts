import { IUIState } from './ui-interfaces';
import { Shape } from 'Types/shape';

export type StateDescription = {
    next: string[];
    actions: Shape<(arg: any) => any>;
};

export type IStateMap = Shape<StateDescription>;

export interface IStateMachine {
    stateMachine: IStateMap;
    defaultState: IUIState;
    state: IUIState;
    prevState: IUIState;

    init(state: IUIState): IStateMachine;
    next(state: IUIState): IStateMachine;
    prev(): IStateMachine;
    default(): IStateMachine;
    interact(fn: (result: any) => any): IStateMachine;
}
