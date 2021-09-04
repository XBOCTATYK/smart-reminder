import { IUIState } from './ui-interfaces';
import { Shape } from 'Types/shape';

export type StateDescription = {
    next: string[];
    actions: Shape<(arg: any) => any>;
};

export type IStateMap = Shape<StateDescription>;

export interface IStateMachine {
    stateMachine: IStateMap;
    initState: IUIState;
    state: IUIState;
    prevState: IUIState;

    next(state: IUIState): IStateMachine;
    prev(): IStateMachine;
    resetState(): IStateMachine;
    interact(fn: (result: any) => any): IStateMachine;
}
