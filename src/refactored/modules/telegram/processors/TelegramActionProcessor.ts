import {ActionProcessor} from "../../common/interfaces/ActionProcessor";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";
import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {EventEmitter} from "events";

@ActionSubscribe()
export class TelegramActionProcessor extends EventEmitter implements ActionProcessor {
    private bot: Telegraf<TelegrafContext>;

    constructor(
        bot: Telegraf<TelegrafContext>
    ) {
        super();
        this.bot = bot
    }

    async process<T>(action: Action<T>) {
        return action
    }

}