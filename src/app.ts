import { Telegraf } from 'telegraf';
import format from 'date-fns/format';

import { ORMConnection } from 'Src/db/orm-connection';
import { getTasksModel } from 'Models/Tasks';
import { getNotifiesModel } from 'Models/Notifies';
import { getUserModel } from 'Models/User';
import { getUsualModel } from 'Models/Usual';
import { remindControls } from 'Src/messages/remind';
import { createNewTask } from 'Utils/createNewTask';
import { createNextNotification } from 'Src/utils/createNextNotification';
import { DATE_FNS_OPTIONS, DATE_FORMAT, TIME_FORMAT } from 'Constants/formats';
import { dateControls, priorityControls } from 'Src/messages/taskCreating';
import { UserService } from 'Services/User';
import { STATES } from 'Constants/states';

import { notificationCallback } from 'Src/callbacks/notificationCallback';
import { getDateNow } from 'Utils/dates';
import { creatingTaskCallback } from 'Src/callbacks/creatingTaskCallback';

const TOKEN = '1265591775:AAEClLeEmSAsMQR6d_V0FkzL6O7C8HupQn8';

setTimeout(() => {

    const DB = new ORMConnection(process.env.DATABASE_URL, [
        getUserModel,
        getTasksModel,
        getNotifiesModel,
        getUsualModel,
    ]);

    const bot = new Telegraf(TOKEN);
    bot.command('start', (ctx) => {
        let state = 'from';
        let fromTime = '09:00';
        let toTime = '22:00';

        ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
            bot.hears(/[0-9]{1,2}:[0-9]{2}/, ctx => {
                switch (state) {
                    case 'from':
                        fromTime = ctx.message.text;
                        ctx.reply('В какое время прекращать присылать напоминания?');
                        state = 'to';
                        break;
                    case 'to':
                        toTime = ctx.message.text;
                        DB.model('User').create({ id: ctx.message.from.id, time_from: fromTime, time_to: toTime }).then(() => {
                            ctx.reply('Спасибо! Ваши настройки сохранены!');
                        }).catch(() => {
                            ctx.reply('Произошла ошибка! Попробуйте ввести данные еще раз.');
                            ctx.reply('В какое время прекращать присылать напоминания?');
                            state = 'from';
                        });
                        break;
                    default:
                        break;
                }
            })
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

        UserService(userId, STATES.ENTER_TASK_NAME, options);
    });

    bot.on('text', ctx => {
        const userId = ctx?.message?.from?.id;
        const User = UserService(userId);
        const currentState = User.state();

        switch (currentState) {
                case STATES.ENTER_TASK_NAME:
                    User.addData({ name: ctx.message.text }).setState(STATES.ENTER_TASK_PRIORITY);
                    ctx.reply('Какой приоритет задачи?', priorityControls());
                    break;
                case STATES.ENTER_TASK_PRIORITY:
                    const priority = ctx.message.text;
                    const priorityAsNumber = priority === 'f' ? 5 : parseInt(priority);

                    if (isNaN(priorityAsNumber)) {
                        ctx.reply('Приоритет должен быть числом (желательно от 0 до 20). Попробуйте еще раз.');
                        break;
                    }

                    User.addData({ priority: priorityAsNumber }).setState(STATES.ENTER_TASK_DATE);
                    ctx.reply('На какую дату планируете?', dateControls());
                    break;
                case STATES.ENTER_TASK_DATE:
                    let date = ctx.message.text.toLowerCase();

                    if (date === 'сегодня' || date === 'f') {
                        date = getDateNow();
                    }

                    User.addData({ date }).setState(STATES.ENTER_TASK_TIME);
                    ctx.reply('На какое время планируете?');
                    break;
                case STATES.ENTER_TASK_TIME:
                    const options = {} as any;
                    options.time = ctx.message.text;

                    options.startTime = format(new Date(), TIME_FORMAT, DATE_FNS_OPTIONS);
                    options.startDate = getDateNow();
                    User.addData(options);

                    console.log(userId);

                    createNewTask(DB, { user_id: userId, ...User.data() }).then(() => {
                        ctx.reply('Напоминание создано!');
                        User.done();
                    }).catch(err => {
                        User.setState(STATES.CREATING_TASK_ERROR);
                        ctx.reply('Произошла ошибка при создании задачи!')
                    });
                    break;
                default:
                    break;
            }
    });

    setInterval(() => {
        const date = new Date();
        const thisTime = format(date, TIME_FORMAT, DATE_FNS_OPTIONS);
        const thisDate = format(date, DATE_FORMAT, DATE_FNS_OPTIONS);

        DB.model('Tasks').findAll({ where: { time: thisTime, date: thisDate, done: false } }).then((result) => {
            result.forEach( item => {
                const { dataValues } = item;
                bot.telegram.sendMessage(dataValues.user_id, `Крайний срок задачи: ${dataValues.name} - ${dataValues.time} ${dataValues.date}`);
            })
        });

        DB.model('Tasks').update(( { done: true } ), { where: { time: thisTime, date: thisDate } } );

        DB.model('Notifies').findAll({ where: { time: thisTime, date: thisDate }, include: [ DB.model('Tasks') ] }).then((result) => {
            result.forEach( item => {
                const { dataValues: notify } = item;
                const { Task: { dataValues: task }} = notify;

                delete notify.Task;

                const value = { ...task, ...notify };
                bot.telegram.sendMessage(value.user_id, `Напоминание: ${value.name} - ${task.time} ${task.date}`, remindControls(task, notify));

                createNextNotification(DB, task).then(() => {})
                    .catch(() => {
                        bot.telegram.sendMessage(value.user_id, 'Ошибка при создании следующего напоминания');
                    })

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
