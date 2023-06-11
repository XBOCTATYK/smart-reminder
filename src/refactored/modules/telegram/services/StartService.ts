import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {UserDefaultsConfig} from "../../common/configs/UserDefaultsConfig";
import {Channel} from "../../common/interfaces/Channel";

export class StartService {
    bot: Telegraf<TelegrafContext>
    private config: UserDefaultsConfig;
    private channel: Channel;

    constructor(
        bot: Telegraf<TelegrafContext>,
        channel: Channel,
        config: UserDefaultsConfig
) {
        this.bot = bot;
        this.config = config;
        this.channel = channel;

        this.init()
    }

    private init() {
        this.bot.command('start', (ctx) => {
            const userId = ctx.message.from.id;
            const fromTime = this.config.notifications.from;
            const toTime = this.config.notifications.to;

            ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
                this.channel.send({ type: 'USER_START', payload: { userId, fromTime, toTime } })
            });
        });
    }
}