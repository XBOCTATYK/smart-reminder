import {Action} from "./Action";

export class HandlerResult {
    static Done = class HandlerResultSuccess<T> extends HandlerResult {
        private action: Action<T>;
        constructor(action?: Action<T>) {
            super();
            this.action = action;
        }
    }

    static Error = class HandlerResultError<T> extends HandlerResult {
        private action: Action<T>;
        private error: Error;

        constructor(err: Error, action?: Action<T>) {
            super();
            this.action = action;
            this.error = err;
        }
    }
}

export interface HandlerClass {
    handle<T>(action: Action<T>): Promise<HandlerResult>
}

export type HandlerFunction<T> = (action: Action<T>) => Promise<HandlerResult>

export type HandlerGenerator<T> = Generator<Action<T>, Promise<HandlerResult>, Promise<HandlerResult>>

export type Handler<T> = HandlerClass | HandlerFunction<T> | HandlerGenerator<T>