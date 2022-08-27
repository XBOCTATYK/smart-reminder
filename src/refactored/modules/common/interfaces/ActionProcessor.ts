import {Action} from "./Action";
import {EventEmitter} from "events";

export interface ActionProcessor extends EventEmitter {
    process<T>(action: Action<T>): void
}