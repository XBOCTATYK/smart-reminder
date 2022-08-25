import {Action} from "../../interfaces/Action";

export function ActionSubscribe(): ClassDecorator {
    return function (constructor) {
        const targetMethod = constructor.prototype.process;

        if (!(targetMethod instanceof Function)) {
            throw new Error('You must give object with async method "process"')
        }

        constructor.prototype.process = async function<T> (action: Action<T>) {
            await targetMethod(action)
            this.emit('action', action)
            return action
        }
    }
}