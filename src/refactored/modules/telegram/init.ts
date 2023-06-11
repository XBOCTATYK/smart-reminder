import {BotConfig} from "./config/BotConfig";
import {Channel} from "../common/interfaces/Channel";
import {TelegramActionProcessor} from "./processors/TelegramActionProcessor";
import {Telegraf} from "telegraf";
import {StartService} from "./services/StartService";
import {UserDefaultsConfig} from "../common/configs/UserDefaultsConfig";
import {UserService, UserStateService} from "./services/User";

type TelegramModuleConfig = BotConfig & UserDefaultsConfig

const TELEGRAM_MODULE_SERVICES = {
    USER_STATE: 'USER_STATE',
    BOT_START: 'BOT_START'
}

const CHANNELS = {
    USER_INTERACTION: 'USER_INTERACTION'
}

export default class TelegramModule {
    private readonly config: TelegramModuleConfig;
    private services: Record<any, any>;
    private channels: Record<any, Channel>;

    constructor(imports: any[], config: TelegramModuleConfig) {
        this.config = config;

        this.init();
    }

    init() {
        const bot = new Telegraf(this.config.apiKey)

        this.services = {
            [TELEGRAM_MODULE_SERVICES.USER_STATE]: UserStateService,
            [TELEGRAM_MODULE_SERVICES.BOT_START]: new StartService(bot, UserStateService, this.config)
        };

        this.channels = {
            [CHANNELS.USER_INTERACTION]: new TelegramActionProcessor(bot)
        }
    }

    export() {
        return {
            services: this.services,
            channels: this.channels
        }
    }
}