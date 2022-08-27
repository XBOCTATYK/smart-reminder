import {Action} from "../../common/interfaces/Action";
import {HandlerClass, HandlerResult} from "../../common/interfaces/Handler";

export class ShowListHandler implements HandlerClass<string[]> {
    constructor(

    ) {

    }

    async handle(action: Action<string[]>): Promise<HandlerResult> {
        return new HandlerResult.Done()
    }
}