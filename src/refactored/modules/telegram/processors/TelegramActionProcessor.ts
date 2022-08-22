import {ActionProcessor} from "../../common/interfaces/ActionProcessor";
import {Action} from "../../common/interfaces/Action";
import {ActionSubscribe} from "../../common/utils/decorators/ActionSubscribe";
import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";

@ActionSubscribe()
export class TelegramActionProcessor implements ActionProcessor {
    private bot: Telegraf<TelegrafContext>;

    constructor(
        bot: Telegraf<TelegrafContext>
    ) {
        this.bot = bot
    }

    async process<T>(action: Action<T>) {
        return action
    }

}