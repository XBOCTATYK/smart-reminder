import {Logger} from "ts-loader/dist/logger";
import {MessageBunchLoader, MessageService} from "./interfaces";

export class MessageServiceImpl implements MessageService {
    messages: Record<string, any> = null
    messagesLoader: MessageBunchLoader

    constructor(messagesLoader: MessageBunchLoader, logger: Logger) {
        this.messagesLoader = messagesLoader
        this.init().then(() => logger.logInfo('Messages successfully loaded!'))
    }

    private async init() {
        this.messages = await this.messagesLoader.load()
    }

    getMessage(key: string): string {
        return this.messages[key] ?? ''
    }
}