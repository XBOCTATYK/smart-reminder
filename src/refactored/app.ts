import pino from "pino";
import TelegramModule, {TelegramModuleConfig} from "./modules/telegram/init";
import {MainConfigLoader} from "./modules/common/services/MainConfigLoader";
import {FileConfigLoader} from "./modules/common/services/FileConfigLoader";
import {JSONDecoder} from "./modules/common/utils/decoders/JSONDecoder";
import {ObjectConfigLoader} from "./modules/common/services/ObjectConfigLoader";
import {COMMON_MODULE_SERVICES, CommonModule, CommonModuleConfig} from "./modules/common/init";

type MainAppConfig = TelegramModuleConfig & CommonModuleConfig

(async () => {
    const logger = pino();

    const fileConfigLoaders = [
        new FileConfigLoader(new JSONDecoder(), logger, 'application.json'),
        new FileConfigLoader(new JSONDecoder(), logger, 'application-testing.json'),
    ]
    const filesConfigLoader = new MainConfigLoader(new Set(fileConfigLoaders))
    const filesConfig = await filesConfigLoader.load() as CommonModuleConfig

    const commonModule = new CommonModule(filesConfig, logger).init()
    const dbConfigLoader = commonModule.export().services[COMMON_MODULE_SERVICES.DB_CONFIG_LOADER]

    const configLoader = new MainConfigLoader(new Set([
        new ObjectConfigLoader(filesConfig),
        dbConfigLoader
    ]))

    const config = await configLoader.load() as MainAppConfig

    console.log(config)

    const modules = [
        new TelegramModule([], { ...config })
    ]

    modules.map(module => module.init())
})()



