import {EventEmitter} from "events";
import {ActionProcessor} from "../../common/interfaces/ActionProcessor";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";

@ActionSubscribe()
export class NotificationActionProcessor extends EventEmitter implements ActionProcessor  {

    process<T>(action: Action<T>) {

    }
}