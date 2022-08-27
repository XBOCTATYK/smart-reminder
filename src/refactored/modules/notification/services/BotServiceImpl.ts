import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {UserSessionService} from "../../common/services/interfaces";

export class BotServiceImpl {
    private bot: Telegraf<TelegrafContext>;
    private userSessionService: UserSessionService;

    constructor(
        bot: Telegraf<TelegrafContext>,
        userSessionService: UserSessionService
    ) {
        this.bot = bot
        this.userSessionService = userSessionService
    }

    init() {
        this.bot.start()
    }
}