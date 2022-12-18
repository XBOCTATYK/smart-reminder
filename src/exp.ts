import {NotificationActionChannel} from "./refactored/modules/notification/processors/NotificationActionChannel";
import {HandlerResult} from "./refactored/modules/common/interfaces/Handler";


const t = new NotificationActionChannel().on('action', a => console.log(a))

console.log('ins', new HandlerResult.Done() instanceof HandlerResult.Done)