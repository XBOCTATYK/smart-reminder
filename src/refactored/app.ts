import pino from "pino";
import TelegramModule, {TelegramModuleConfig} from "./modules/telegram/init";
import {MainConfigLoader} from "./modules/common/services/MainConfigLoader";
import {FileConfigLoader} from "./modules/common/services/FileConfigLoader";
import {JSONDecoder} from "./modules/common/utils/decoders/JSONDecoder";
import {DBConfigLoader} from "./modules/common/services/DBConfigLoader";

type MainAppConfig = TelegramModuleConfig

(async () => {
    const logger = pino();


    const fileConfigLoaders = [
        new FileConfigLoader(new JSONDecoder(), logger, 'application'),
        new FileConfigLoader(new JSONDecoder(), logger, 'application-testing'),
        new DBConfigLoader()
    ]
    const configLoader = new MainConfigLoader(new Set(fileConfigLoaders))
    const config = await configLoader.load() as MainAppConfig

    const modules = [
        new TelegramModule([], { ...config })
    ]

    modules.map(module => module.init())
})()



