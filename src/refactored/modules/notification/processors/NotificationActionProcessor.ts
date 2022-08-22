import {ActionProcessor} from "../../common/interfaces/ActionProcessor";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";

@ActionSubscribe()
export class NotificationActionProcessor implements ActionProcessor  {

    async process<T>(action: Action<T>) {

        return action
    }
}