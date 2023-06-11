import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {STATES} from "../constants/states";
import {UserService, UserStateService} from "../../../../services/User";
import {UserDefaultsConfig} from "../../common/configs/UserDefaultsConfig";
import {UserStateType} from "../../../../types/state";
import {UserState} from "./User";

export class StartService {
    bot: Telegraf<TelegrafContext>
    private config: UserDefaultsConfig;

    constructor(
        bot: Telegraf<TelegrafContext>,
        userStateService: (id: number | string, state?: UserStateType, data?: Record<string, any>) => UserState,
        config: UserDefaultsConfig
) {
        this.bot = bot;
        this.config = config;

        this.init()
    }

    private init() {
        this.bot.command('start', (ctx) => {
            const userId = ctx.message.from.id;
            let state = STATES.FROM_TIME;
            let fromTime = this.config.notifications.from;
            let toTime = this.config.notifications.to;

            ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
                UserStateService(userId, state, { fromTime, toTime });
            });
        });
    }
}