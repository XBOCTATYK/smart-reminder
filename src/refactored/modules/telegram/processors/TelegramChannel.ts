import {Channel} from "../../common/interfaces/Channel";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";
import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {EventEmitter} from "events";

@ActionSubscribe()
export class TelegramChannel extends EventEmitter implements Channel {
    private bot: Telegraf<TelegrafContext>;

    constructor(
        bot: Telegraf<TelegrafContext>
    ) {
        super();
        this.bot = bot
    }

    send<T>(action: Action<T>) {
        this.emit(action.type, action.payload)
    }

}