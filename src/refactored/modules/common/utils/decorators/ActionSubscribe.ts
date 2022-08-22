import {Action} from "../../interfaces/Action";
import {EventEmitter} from "events";

export function ActionSubscribe() {
    return function (constructor: Function) {
        Object.setPrototypeOf(constructor.prototype, EventEmitter)
        constructor.prototype.process = function<T> (action: Action<T>) {
            this.process(action).then(action => this.emit('action', action))
        }
    }
}