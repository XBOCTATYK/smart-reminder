import {NotificationActionProcessor} from "./refactored/modules/notification/processors/NotificationActionProcessor";
import {HandlerResult} from "./refactored/modules/common/interfaces/Handler";


const t = new NotificationActionProcessor().on('action', a => console.log(a))

console.log('ins', new HandlerResult.Done() instanceof HandlerResult.Done)