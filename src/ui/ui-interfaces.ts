import { Shape } from 'Types/shape';

// raw case of interface
export interface IUIState<CTX = any> {
    name: string;
    tgContext: CTX;
    appContext: any;
    onEnter(): string;
    onLeave(): string;
    interact(input: string): Promise<boolean>;
    onError(err: Error): any;
}

// action sends to state
export interface Action<T> {
    execute(): T;
}
