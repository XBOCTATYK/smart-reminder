import { Telegraf } from 'telegraf';
import format from 'date-fns/format';

import { ORMConnection } from 'Src/db/orm-connection';
import { getTasksModel } from 'Models/Tasks';
import { getNotifiesModel } from 'Models/Notifies';
import { getUserModel } from 'Models/User';
import { getUsualModel } from 'Models/Usual';
import { remindControls } from 'Src/messages/remind';
import { createNewTask } from 'Src/utils/createNewTask';
import { createNextNotification } from 'Src/utils/createNextNotification';
import { DATE_FNS_OPTIONS } from 'Src/constants/formats';
import { dateControls } from 'Src/messages/taskCreating';

const TOKEN = '1265591775:AAEClLeEmSAsMQR6d_V0FkzL6O7C8HupQn8';

function getDateNow() {
    return format(new Date(), 'dd.MM.yyyy', DATE_FNS_OPTIONS);
}

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
            user_id: userId,
            name: 'Новая задача',
            priority: 5,
            time: null,
            startTime: null,
            startDate: null,
            date: getDateNow(),
        };
        let state = 'taskName';

        ctx.reply('Что планируете сделать?');

        bot.on('text', ctx1 => {
            if (userId === ctx1.message.from.id) {
                switch (state) {
                    case 'taskName':
                        options.name = ctx1.message.text;
                        state = 'taskPriority';
                        ctx1.reply('Какой приоритет задачи?');
                        break;
                    case 'taskPriority':
                        const priority = ctx1.message.text;

                        const priorityAsNumber = priority === 'f' ? 5 : parseInt(priority);

                        if (isNaN(priorityAsNumber)) {
                            ctx1.reply('Приоритет должен быть числом (желательно от 0 до 20). Попробуйте еще раз.');
                            break;
                        }
                        options.priority = priorityAsNumber;
                        state = 'taskDate';
                        ctx1.reply('На какую дату планируете?', dateControls());
                        break;
                    case 'taskDate':
                        let date = ctx1.message.text.toLowerCase();

                        if (date === 'cегодня' || date === 'f') {
                            date = getDateNow();
                        }

                        options.date = date;

                        state = 'taskTime';
                        ctx1.reply('На какое время планируете?');
                        break;
                    case 'taskTime':
                        options.time = ctx1.message.text;

                        options.startTime = format(new Date(), 'HH:mm', DATE_FNS_OPTIONS);
                        options.startDate = getDateNow();

                        createNewTask(DB, options).then(() => {
                            ctx1.reply('Напоминание создано!')
                        }).catch(err => {
                            state = 'end';
                            ctx1.reply('Произошла ошибка при создании задачи!')
                        });
                        break;
                    default:
                        break;
                }
            }
        })
    });

    setInterval(() => {
        const date = new Date();
        const thisTime = format(date, 'HH:mm', DATE_FNS_OPTIONS);
        const thisDate = format(date, 'dd.MM.yyyy', DATE_FNS_OPTIONS);

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

    bot.on('callback_query', async (ctx) => {
        const callback_id = ctx.update?.callback_query?.id;
        console.log(ctx.update?.callback_query?.data);
        const { taskId, notifNed, notifyId, answerId } = JSON.parse(ctx.update?.callback_query?.data);

        const messageAnswers = {
            Y: 'Отлично!',
            N: 'ОК! Повторим напоминание чуть позже',
            D: 'Отлично! Больше не напоминаю.'
        };

        try {
            // @ts-ignore
            const notifyExists = await DB.model('Notifies').findOne({ where: { id: notifyId }});

            console.log(notifyExists)

            if (notifyExists) {
                switch (answerId) {
                    case 'Y':
                        await DB.model('Notifies').destroy({ where: { id: notifyId } });
                        break;
                    case 'N':
                        await DB.model('Tasks').update(({ notificationsNeed: notifNed + 1 }), { where: { id: taskId } });
                        await DB.model('Notifies').destroy({ where: { id: notifyId } });
                        break;
                    case 'D':
                        await DB.model('Tasks').update(({ done: true }), { where: { id: taskId } });
                        await DB.model('Notifies').destroy({ where: { id: notifyId } });
                        break;
                    default:
                        console.log('Unrecognized answer')
                }

                ctx.reply(messageAnswers[answerId])
            } else {
                ctx.reply('Вы уже давали ответ на это напоминание!')
            }

        } catch (e) {
            ctx.reply('Что-то пошло не так');
            console.log(e)
        }
    });

    bot.command('stop', (ctx) => {

    });

    bot.launch();


}, 0);
