import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {UserSessionService} from "../../common/services/interfaces";
import {UserSession} from "../../common/interfaces/UserSession";

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
        this.bot.use(async (ctx: TelegrafContext & { session: UserSession }, next) => {
            ctx.session = await this.userSessionService.getSessionById(ctx.message.from.id)
            await next()
        })
        this.bot.start()
    }
}