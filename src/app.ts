import { Telegraf } from 'telegraf';
import pino from 'pino';

import { STATES } from 'Constants/states';

import { UserStateService } from 'Services/User';
import { getModel } from 'Utils/db/get-model';
import {
    NOTIFICATION_ENTITY_KEY,
    TASK_ENTITY_KEY,
    USER_ENTITY_KEY,
    USER_PARAMS_ENTITY_KEY,
} from 'Constants/enitityNames';
import { showTaskList } from 'Utils/user-stories/taskList';
import { User } from 'Domain/entities/User';
import { ParamsCases } from 'Src/use-cases/params-cases';
import { ParamsRepository } from 'Repository/params.repository';
import { UserCases } from 'Src/use-cases/user/user-cases';
import { BanListCases } from 'Src/use-cases/ban-list/ban-list-cases';
import { UserRepository } from 'Repository/user.repository';
import { TaskCases } from 'Src/use-cases/task/task-cases';
import { NotifyRepository } from 'Repository/notify.repository';
import { TaskRepository } from 'Repository/task.repository';
import { NotificationsCases } from 'Src/use-cases/notifications/notifications-cases';
import { TELEGRAM_UI_STATE_MACHINE, TelegramStateMachine } from 'Src/ui/state-machine';
import { PendingTaskState } from 'Src/ui/states/pending-task.state';

const logger = pino();

setTimeout( async () => {
    const DB = getModel();

    logger.info('Getting config from base!');
    const paramsInteractor = new ParamsCases(new ParamsRepository(DB.model(USER_PARAMS_ENTITY_KEY)));
    const paramsList = await paramsInteractor.getList();

    const SETTINGS = paramsList.reduce((accumulator, item) => {
        const { key, value } = item;
        return { ...accumulator, [key]: value }
    }, {});

    logger.info('Config accepted! %o', SETTINGS);

    const banListInteractor = new BanListCases();
    const userRepository = new UserRepository(DB.model(USER_ENTITY_KEY));
    const userInteractor = new UserCases(
        userRepository,
        banListInteractor,
    );
    const notificationRepository = new NotifyRepository(DB.model(NOTIFICATION_ENTITY_KEY), DB.model(TASK_ENTITY_KEY));
    const taskRepository = new TaskRepository(DB.model(TASK_ENTITY_KEY));
    const taskInteractor = new TaskCases(
        userRepository,
        notificationRepository,
        taskRepository,
        userInteractor,
    );
    const notificationInteractor = new NotificationsCases(
        userRepository,
        taskRepository,
        notificationRepository,
    );

    const StateMachine = new TelegramStateMachine(TELEGRAM_UI_STATE_MACHINE, new PendingTaskState<any>());

    const bot = new Telegraf(SETTINGS.TOKEN);

    bot.command('start', (ctx) => {
        const userId = ctx.message.from.id;
        const state = STATES.FROM_TIME;
        const startTime = '09:00';
        const endTime = '22:00';

        ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
            const userEntity = new User({ id: userId, startTime, endTime, timezone: 0 });
            UserStateService(userId, state, userEntity);
        });
    });



    bot.on('text', async (ctx) => {
        const userId = ctx?.message?.from?.id;
        const UserState = UserStateService(userId);
        const currentState = UserState.state();


    });

    bot.command('list', async (ctx) => {
        const userId = ctx?.message?.from?.id;

        const taskList = await taskInteractor.getTaskList(userId);
        const listString = await showTaskList(taskList);
        const [ message ] = listString;

        if (message === '') {
            await ctx.reply('У вас нет ни одной запланированной задачи.');
            return;
        }

        await ctx.reply(...listString);

    });


    await bot.launch();
}, 10)

/*setTimeout(async () => {
    const DB = getModels();

    logger.info('Getting config from base!');
    const Params = await DB.model(USER_PARAMS_ENTITY_KEY).findAll();
    const SETTINGS = {
        TOKEN: ''
    };
    Params.forEach(item => {
        const { key, value } = item;
        SETTINGS[key] = value;
    });

    logger.info('Config accepted! %o', SETTINGS);

    const bot = new Telegraf(SETTINGS.TOKEN);
    bot.command('start', (ctx) => {
        const userId = ctx.message.from.id;
        let state = STATES.FROM_TIME;
        let fromTime = '09:00';
        let toTime = '22:00';

        ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
            UserStateService(userId, state, { fromTime, toTime });
        });
    });

    bot.command('task', (ctx) => {
        const userId = ctx.message.from.id;

        logger.info('Starting to create task. UserID: %s', userId);

        const options = {
            name: 'Новая задача',
            priority: 5,
            time: null,
            startTime: null,
            startDate: null,
            date: getDateNow()
        };

        ctx.reply('Что планируете сделать?');

        UserStateService(userId, STATES.ENTER_TASK_NAME, options).setState(STATES.ENTER_TASK_NAME);
    });

    bot.command('list', async (ctx) => {
        const userId = ctx?.message?.from?.id;

        const listString = await showTaskList(userId, logger);
        const [ message ] = listString;

        if (message === '') {
            await ctx.reply('У вас нет ни одной запланированной задачи.');
            return;
        }

        await ctx.reply(...listString);

    });

    bot.command('ct', async (ctx) => {
        const userId = ctx?.message?.from?.id;

        const defaultOptions = {
            name: 'Новая задача',
            priority: 5,
            time: null,
            startDate: null,
            date: getDateNow()
        };

        const command = ctx?.update?.message?.text;
        const commandArray = command.split(' ');
        const [ , name, date, time, priority ] = commandArray;

        const taskCreateOptions = {
            ...defaultOptions,
            ...{
                user_id: userId,
                name,
                date: date === '-d' ? getDateNow() : date,
                usual: date === '-d' ? [ 0, 0, 1, 0, 0 ] : undefined,
                time,
                priority,
                startTime: format(new Date(), TIME_FORMAT, DATE_FNS_OPTIONS),
                startDate: getDateNow()
            }
        }

        logger.info('Быстрое создание задачи %o', taskCreateOptions)

        try {
            await createNewTask(DB, taskCreateOptions);
            await ctx.reply('Напоминание создано!')
        } catch (e) {
            logger.info('Ошибка при создании быстрой задачи. %o', taskCreateOptions)
            await ctx.reply('Ошибка при создании напоминания!')
        }
    })

    bot.command('/back', (ctx) => {
        const userId = ctx?.message?.from?.id;
        const UserState = UserStateService(userId);

        UserState.setState(STATES.PENDING_TASK);
        ctx.reply('Выберите команду', MainMenu())
    })

    bot.command('relocateTasks', async (ctx) => {
        const userId = ctx?.message?.from?.id;
        const PERMIT_ID = 336322411;

        if (userId == PERMIT_ID) {
            // await relocateDoneTasks(DB);
        }
    })

    bot.on('text', async (ctx) => {
        const userId = ctx?.message?.from?.id;
        const UserState = UserStateService(userId);
        const currentState = UserState.state();
        const incomingMessage = ctx.message.text;

        switch (currentState) {
            case STATES.PENDING_TASK:
                switch (incomingMessage) {
                    case TEXT_COMMANDS.LIST:
                        const listString = await showTaskList(userId, logger);
                        const [ message ] = listString;

                        if (message === '') {
                            await ctx.reply('У вас нет ни одной запланированной задачи.');
                            break;
                        }

                        await ctx.reply(...listString);
                        break;
                    case TEXT_COMMANDS.ADD:
                        await ctx.reply('Что планируете сделать?');

                        UserStateService(userId, STATES.ENTER_TASK_NAME, {}).setState(STATES.ENTER_TASK_NAME);
                        break;
                    default:
                        break;
                }
                break;
            case STATES.ENTER_TASK_NAME:
                UserState.addData({ name: incomingMessage }).setState(STATES.ENTER_TASK_PRIORITY);
                await ctx.reply('Какой приоритет задачи?', priorityControls());
                break;
            case STATES.ENTER_TASK_PRIORITY:
                const priorityAsNumber = parseInt(incomingMessage);

                if (isNaN(priorityAsNumber) || priorityAsNumber > 20) {
                    await ctx.reply('Приоритет должен быть числом (желательно от 0 до 20). Попробуйте еще раз.');
                    break;
                }

                UserState.addData({ priority: priorityAsNumber }).setState(STATES.ENTER_TASK_DATE);
                await ctx.reply('На какую дату планируете?', dateControls());
                break;
            case STATES.ENTER_TASK_DATE:
                let date = incomingMessage.toLowerCase();

                if (!incomingMessage.match(/[\d]{1,2}.[\d]{2}.[\d]{4}/)) {
                    await ctx.reply('Пример правильного формата даты - 11.08.2021. Попробуйте ввести еще раз');
                    break;
                }

                if (date === 'сегодня') {
                    date = getDateNow();
                }

                UserState.addData({ date }).setState(STATES.ENTER_TASK_TIME);
                await ctx.reply('На какое время планируете?');
                break;
            case STATES.ENTER_TASK_TIME:
                const options = {} as any;

                if (!incomingMessage.match(/[\d]{1,2}:[\d]{2}/)) {
                    await ctx.reply('Пример правильного формата времени - 12:00. Попробуйте ввести еще раз');
                    break;
                }

                options.time = incomingMessage;

                options.startTime = format(new Date(), TIME_FORMAT, DATE_FNS_OPTIONS);
                options.startDate = getDateNow();
                UserState.addData(options);

                createNewTask(DB, { user_id: userId, ...UserState.value() }).then(() => {
                    const createdPhrase = randomElement(CREATION_TASK_PHRASES);
                    ctx.reply(createdPhrase);
                    UserState.done();
                }).catch(err => {
                    UserState.setState(STATES.CREATING_TASK_ERROR);

                    const errorPhrase = randomElement(TASK_CREATION_ERROR_PHRASES);
                    ctx.reply(errorPhrase)
                });
                break;
            case STATES.FROM_TIME:
                UserState.addData({ fromTime: incomingMessage }).setState(STATES.TO_TIME);
                await ctx.reply('В какое время прекращать присылать напоминания?');
                break;
            case STATES.TO_TIME:
                UserState.addData({ toTime: incomingMessage });
                DB.model(USER_ENTITY_KEY).create({
                    id: userId,
                    time_from: UserState.value().fromTime,
                    time_to: UserState.value().toTime
                }).then(() => {
                    UserState.setState(STATES.PENDING_TASK);
                    ctx.reply('Спасибо! Ваши настройки сохранены!');
                }).catch(() => {
                    ctx.reply('Произошла ошибка! Попробуйте ввести данные еще раз.');
                    ctx.reply('В какое время прекращать присылать напоминания?');
                    UserState.setState(STATES.TO_TIME);
                });
                break;
            default:
                break;
        }
    });

    setInterval(() => {
        const dateNow = new Date();
        const thisTime = format(dateNow, TIME_FORMAT, DATE_FNS_OPTIONS);
        const thisDate = format(dateNow, DATE_FORMAT, DATE_FNS_OPTIONS);

        logger.info('This date - %s. This time - %s', thisDate, thisTime);

        try {
            DB.model(TASK_ENTITY_KEY).findAll({
                where: {
                    time: thisTime,
                    date: thisDate,
                    done: false
                }
            }).then((result) => {
                if (result && result.length > 0) {
                    result.forEach(item => {
                        const { dataValues: task } = item;
                        logger.info('Крайний срок задачи %d', task.id);

                        const taskTimePhrase = randomElement(TASK_TIME_PHRASES);
                        bot.telegram.sendMessage(task.user_id, `${taskTimePhrase} ${ task.name } - ${ task.time } ${ task.date }`, postponeControls(task.id));
                    })

                    DB.model(TASK_ENTITY_KEY).update(({ done: true }), { where: { time: thisTime, date: thisDate } });
                }
            })
                .then((res) => {
                    console.log('taskDone', res);
                })
                .catch((e) => {
                    logger.error('Ошибка при уведомлении о задаче %o', e);
                });

            // пересоздание задач, которые повторяются
            const replanTask = [];
            DB.model(USUAL_EVENTS_ENTITY_KEY).findAll({
                where: { lastTaskDate: thisDate, lastTaskTime: thisTime },
                include: [ DB.model(TASK_ENTITY_KEY) ]
            }).then(records => {
                records.forEach(async (record) => {
                    const { dataValues: usual } = record;
                    const { Task: { dataValues: task } } = usual;

                    logger.info('Пересоздается задача %d | Usual %d', task.id, usual.id);

                    const nextDate = format(addMinutes(addHours(addDays(dateNow, usual.days), usual.hours), usual.minutes), DATE_FORMAT, DATE_FNS_OPTIONS);

                    const replanResult = await createNewTask(DB, {
                        ...task,
                        date: nextDate,
                        done: false,
                        notificationsDone: 0
                    });
                    await DB.model(USUAL_EVENTS_ENTITY_KEY).update({ lastTaskDate: nextDate }, { where: { task_id: task.id } });
                    replanTask.push(replanResult)
                })

                return replanTask;
            })
                .then((res) => {
                    console.log('tasks replaned', res)
                })
                .catch((e) => {
                    logger.error('Ошибка при перепланировании задачи %o', e);
                })

            DB.model(NOTIFICATION_ENTITY_KEY).findAll({
                where: { time: thisTime, date: thisDate, done: false },
                include: [ DB.model(TASK_ENTITY_KEY) ]
            }).then((result) => {
                result.forEach((item) => {
                    const { dataValues: notify } = item;
                    const { Task: { dataValues: task } } = notify;

                    delete notify.Task;

                    const value = { ...task, ...notify };

                    if (notify.answer !== ANSWERS.CANCELLED) {
                        const randomPhrase = randomElement<string>(NOTIFY_PHRASES);
                        bot.telegram.sendMessage(
                            value.user_id, `
${ randomPhrase }
${ value.name } - ${ task.time } | ${ task.date }
                        `,
                            remindControls(task, notify)
                        );
                    }

                    const notificationsDone = task.notificationsDone + 1;
                    DB.model(TASK_ENTITY_KEY).update({ ...task, notificationsDone }, { where: { id: task.id } });
                    updateNotifies(DB, thisDate, thisTime, task);

                    try {
                        if (notificationsDone <= task.notificationsNeed) {
                            NextNotification.create(task)
                                .then(() => {
                                })
                                .catch(() => {
                                    bot.telegram.sendMessage(value.user_id, 'Ошибка при создании следующего напоминания');
                                })
                        }
                    } catch (e) {
                        console.log(e);
                        throw new Error(`Cannot create notify! ${ e.message }`);
                    }

                })
            })
                .catch((e) => {
                    logger.error('Ошибка при обработки уведомления %o', e);
                })
        } catch (e) {
            logger.error('Ошибка при срабатывании планировщика %o', e);
        }

        if (thisTime === '00:01') {
            relocateDoneTasks(DB);
        }
    }, 60000);

    bot.on('callback_query', (ctx) => {
        creatingTaskCallback(ctx);
        notificationCallback(ctx, DB).then();
        taskSelectCallback(ctx, DB).then();
        taskUnderAction(ctx, DB).then();
        postponeTaskCallback(ctx, DB, logger).then();
    });

    bot.command('stop', (ctx) => {

    });

    await bot.launch();

}, 0);*/
