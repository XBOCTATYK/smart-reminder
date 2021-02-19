import { Shape } from 'Types/shape';

// raw case of interface
export interface IUIState<CTX = any> {
    name: string;
    context: CTX;
    controls(): Shape<any>;
    onEnter(): string;
    onLeave(): string;
    interact(): string;
}

// action sends to state
export interface Action<T> {
    execute(): T;
}
