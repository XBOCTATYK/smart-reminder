import {EventEmitter} from "events";
import {Channel} from "../../common/interfaces/Channel";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";

@ActionSubscribe()
export class NotificationActionChannel extends EventEmitter implements Channel  {

    send<T>(action: Action<T>) {

    }
}