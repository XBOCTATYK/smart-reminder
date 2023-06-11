import {BotConfig} from "./config/BotConfig";
import {Channel} from "../common/interfaces/Channel";
import {TelegramChannel} from "./processors/TelegramChannel";
import {Telegraf} from "telegraf";
import {StartService} from "./services/StartService";
import {UserDefaultsConfig} from "../common/configs/UserDefaultsConfig";
import {UserStateService} from "./services/UserState";
import {Action} from "../common/interfaces/Action";

export type TelegramModuleConfig = BotConfig & UserDefaultsConfig

const TELEGRAM_MODULE_SERVICES = {
    USER_STATE: 'USER_STATE',
    BOT_START: 'BOT_START'
}

const CHANNELS = {
    USER_INTERACTION: 'USER_INTERACTION'
}

export default class TelegramModule {
    private readonly config: TelegramModuleConfig;
    private services: Record<string, any>;
    private channels: Record<string, Channel>;
    private actionTypes: Action<Record<string, any>>[];

    constructor(imports: any[], config: TelegramModuleConfig) {
        this.config = config;

        this.init();
    }

    init() {
        const bot = new Telegraf(this.config.apiKey)
        const telegramChannel = new TelegramChannel(bot)

        this.services = {
            [TELEGRAM_MODULE_SERVICES.USER_STATE]: UserStateService,
            [TELEGRAM_MODULE_SERVICES.BOT_START]: new StartService(bot, telegramChannel, this.config)
        };

        this.channels = {
            [CHANNELS.USER_INTERACTION]: telegramChannel
        }
    }

    export() {
        return {
            services: this.services,
            channels: this.channels,
            actionTypes: this.actionTypes
        }
    }
}