import { Shape } from 'Types/shape';

// raw case of interface
export interface IUIState<CTX = any> {
    name: string;
    context: CTX;
    onEnter(): string;
    onLeave(): string;
    interact(input: string): Promise<boolean>;
    onError(err: Error): any;
    onCallback(): any;
}

// action sends to state
export interface Action<T> {
    execute(): T;
}
