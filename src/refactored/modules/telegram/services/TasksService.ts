import {Telegraf} from "telegraf";
import {TelegrafContext} from "telegraf/typings/context";
import {Channel} from "../../common/interfaces/Channel";
import {Matcher} from "./interfaces";
import {MATCHER_NAMES} from "./matchers/names";

export const TASK_SERVICE_ACTIONS = {
    TASK_LIST_REQUEST: 'REQUEST_TASK_LIST',
    TASK_LIST_READY: 'TASK_LIST_READY',
    TASK_CREATING_START: 'TASK_CREATING_START',
    TASK_CREATING_DONE: 'TASK_CREATING_DONE',
    TASK_CREATING_FAIL: 'TASK_CREATING_FAIL',
}

export class TasksService {
    private bot: Telegraf<TelegrafContext>
    private channel: Channel;
    private readonly matchers: Matcher<any>[];

    private matcherToAction = {
        [MATCHER_NAMES.CREATE_TASK]: TASK_SERVICE_ACTIONS.TASK_CREATING_START
    }

    constructor(bot: Telegraf<TelegrafContext>, channel: Channel, matchers: Matcher<any>[]) {
        this.bot = bot;
        this.channel = channel;
        this.matchers = matchers;
    }

    private init() {
        this.bot.command('list', (ctx) => {
            this.channel.send({ type: TASK_SERVICE_ACTIONS.TASK_LIST_REQUEST, payload: ctx })
        })

        this.bot.on('text', (ctx) => {
            const incomingMessage = ctx.message.text;
            const userId = ctx?.message?.from?.id;

            const suitableMatcher = this.matchers.find(matcher => matcher.isMatching(incomingMessage))
            const acton = this.matcherToAction[suitableMatcher.name]
            const data = suitableMatcher.selectData(incomingMessage)

            this.channel.send({ type: acton, payload: { ...data, userId } })
        })
    }
}