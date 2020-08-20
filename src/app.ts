import { Telegraf } from 'telegraf';
import format from 'date-fns/format';
import { addDays, addHours, addMinutes } from 'date-fns';

import { STATES } from 'Constants/states';
import { remindControls } from 'Src/messages/remind';
import { createNewTask } from 'Utils/createNewTask';
import { DATE_FNS_OPTIONS, DATE_FORMAT, TIME_FORMAT } from 'Constants/formats';
import { dateControls, priorityControls } from 'Src/messages/taskCreating';

import { UserStateService } from 'Services/User';
import { notificationCallback } from 'Src/callbacks/notificationCallback';
import { creatingTaskCallback } from 'Src/callbacks/creatingTaskCallback';
import { getDateNow } from 'Utils/dates';
import { getModels } from 'Utils/db/getModels';
import { TaskListService } from 'Services/Task';
import { NextNotification } from 'Services/Notification';

setTimeout(async () => {
    const DB = getModels();

    const Params = await DB.model('Params').findAll();
    const SETTINGS = {
        TOKEN: ''
    };
    Params.forEach(item => {
        const { key, value } = item;
        SETTINGS[key] = value;
    });

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
        const options = {
            name: 'Новая задача',
            priority: 5,
            time: null,
            startTime: null,
            startDate: null,
            date: getDateNow(),
        };

        ctx.reply('Что планируете сделать?');

        UserStateService(userId, STATES.ENTER_TASK_NAME, options).setState(STATES.ENTER_TASK_NAME);
    });

    bot.command('list', async (ctx) => {
        const userId = ctx?.message?.from?.id;
        const UserTaskList = await TaskListService.create(userId);

        const formattedString = UserTaskList.value().reduce((string, item) => {
            string += `${item.date} | ${item.time} | ${item.name} \n`;
            return string;
        }, '');

        await ctx.reply(formattedString);
    });

    bot.on('text', async (ctx) => {
        const userId = ctx?.message?.from?.id;
        const UserState = UserStateService(userId);
        const currentState = UserState.state();
        const incomingMessage = ctx.message.text;

        switch (currentState) {
                case STATES.ENTER_TASK_NAME:
                    UserState.addData({ name: incomingMessage }).setState(STATES.ENTER_TASK_PRIORITY);
                    ctx.reply('Какой приоритет задачи?', priorityControls());
                    break;
                case STATES.ENTER_TASK_PRIORITY:
                    const priority = incomingMessage;
                    const priorityAsNumber = parseInt(priority);

                    if (isNaN(priorityAsNumber)) {
                        ctx.reply('Приоритет должен быть числом (желательно от 0 до 20). Попробуйте еще раз.');
                        break;
                    }

                    UserState.addData({ priority: priorityAsNumber }).setState(STATES.ENTER_TASK_DATE);
                    ctx.reply('На какую дату планируете?', dateControls());
                    break;
                case STATES.ENTER_TASK_DATE:
                    let date = incomingMessage.toLowerCase();

                    if (date === 'сегодня') {
                        date = getDateNow();
                    }

                    UserState.addData({ date }).setState(STATES.ENTER_TASK_TIME);
                    ctx.reply('На какое время планируете?');
                    break;
                case STATES.ENTER_TASK_TIME:
                    const options = {} as any;
                    options.time = incomingMessage;

                    options.startTime = format(new Date(), TIME_FORMAT, DATE_FNS_OPTIONS);
                    options.startDate = getDateNow();
                    UserState.addData(options);

                    createNewTask(DB, { user_id: userId, ...UserState.value() }).then(() => {
                        ctx.reply('Напоминание создано!');
                        UserState.done();
                    }).catch(err => {
                        UserState.setState(STATES.CREATING_TASK_ERROR);
                        ctx.reply('Произошла ошибка при создании задачи!')
                    });
                    break;
                case STATES.FROM_TIME:
                    UserState.addData({ fromTime: incomingMessage }).setState(STATES.TO_TIME);
                    ctx.reply('В какое время прекращать присылать напоминания?');
                    break;
                case STATES.TO_TIME:
                    UserState.addData({ toTime: incomingMessage });
                    DB.model('User').create({
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

        DB.model('Tasks').findAll({ where: { time: thisTime, date: thisDate, done: false } }).then((result) => {
            const replanTask = [];

            result.forEach( item => {
                const { dataValues } = item;
                bot.telegram.sendMessage(dataValues.user_id, `Крайний срок задачи: ${dataValues.name} - ${dataValues.time} ${dataValues.date}`);
            })
        });

        // пересоздание задач, которые повторяются
        const replanTask = [];
        DB.model('Usual').findAll({ where: { lastTaskDate: thisDate, lastTaskTime: thisTime }, include: [ DB.model('Tasks') ] }).then(records => {
            records.forEach( record => {
                const { dataValues: usual } = record;
                const { Task: { dataValues: task }} = usual;

                const nextDate = format(addMinutes(addHours(addDays(dateNow, usual.days), usual.hours), usual.minutes), DATE_FORMAT, DATE_FNS_OPTIONS);

                replanTask.push({ ...task, date: nextDate})
            })

            DB.model('Tasks').bulkCreate(replanTask);
        })

        DB.model('Tasks').update(( { done: true } ), { where: { time: thisTime, date: thisDate } } );

        DB.model('Notifies').findAll({ where: { time: thisTime, date: thisDate }, include: [ DB.model('Tasks') ] }).then((result) => {
            result.forEach( item => {
                const { dataValues: notify } = item;
                const { Task: { dataValues: task }} = notify;

                delete notify.Task;

                const value = { ...task, ...notify };
                bot.telegram.sendMessage(value.user_id, `Напоминание: ${value.name} - ${task.time} | ${task.date}`, remindControls(task, notify));

                const notificationsDone = task.notificationsDone + 1;
                DB.model('Tasks').update({ ...task, notificationsDone }, { where: { id: task.id } });

                try {
                    if (notificationsDone <= task.notificationsNeed) {
                        NextNotification.create(task)
                            .then(() => {})
                            .catch(() => {
                                bot.telegram.sendMessage(value.user_id, 'Ошибка при создании следующего напоминания');
                            })
                    }
                } catch (e) {
                    console.log(e);
                    throw new Error(`Cannot create notify! ${e.message}`);
                }

            })
        })
    }, 60000);

    bot.on('callback_query', (ctx) => {
        creatingTaskCallback(ctx);
        notificationCallback(ctx, DB).then();
    });

    bot.command('stop', (ctx) => {

    });

    bot.launch();


}, 0);
