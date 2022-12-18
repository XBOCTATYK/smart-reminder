import {Action} from "./Action";
import {EventEmitter} from "events";

export interface Channel extends EventEmitter {
    send<T>(action: Action<T>): void
}