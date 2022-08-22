import {Action} from "./Action";

export interface ActionProcessor {
    process<T>(action: Action<T>): Promise<Action<T>>
}