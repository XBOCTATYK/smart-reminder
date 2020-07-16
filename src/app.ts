import { Telegraf } from 'telegraf';
import format from 'date-fns/format';

import { ORMConnection } from 'Src/db/orm-connection';
import { getTasksModel } from 'Models/Tasks';
import { getNotifiesModel } from 'Models/Notifies';
import { getUserModel } from 'Models/User';
import { getUsualModel } from 'Models/Usual';
import { remindControls } from 'Src/messages/remind';

const TOKEN = '1265591775:AAEClLeEmSAsMQR6d_V0FkzL6O7C8HupQn8';

function getDateNow() {
    return format(new Date(), 'dd.MM.yyyy');
}

setTimeout(() => {

    const DB = new ORMConnection(process.env.DATABASE_URL, [
        getUserModel,
        getTasksModel,
        getNotifiesModel,
        getUsualModel,
    ])

    const bot = new Telegraf(TOKEN);
    bot.command('start', (ctx) => {
        let state = 'from';
        let from = '09:00';
        let to = '22:00';

        ctx.reply('С какого времени вам нужно начинать напоминать?').then(() => {
            bot.hears(/[0-9]{2}:[0-9]{2}/, ctx => {
                switch (state) {
                    case 'from':
                        from = ctx.message.text;
                        ctx.reply('В какое время прекращать присылать напоминания?')
                        state = 'to';
                        break;
                    case 'to':
                        to = ctx.message.text;
                        DB.model('User').create({ id: ctx.message.from.id, time_from: from, time_to: to }).then(() => {
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
                        const priority = parseInt(ctx1.message.text);
                        if (isNaN(priority)) {
                            ctx1.reply('Приоритет должен быть числом (желательно от 0 до 20). Попробуйте еще раз.');
                            break;
                        }
                        options.priority = priority;
                        state = 'taskDate';
                        ctx1.reply('На какую дату планируете?');
                        break;
                    case 'taskDate':
                        let date = ctx1.message.text;

                        if (date === 'Сегодня') {
                            date = getDateNow();
                        }

                        options.date = date;

                        state = 'taskTime';
                        ctx1.reply('На какое время планируете?');
                        break;
                    case 'taskTime':
                        options.time = ctx1.message.text;

                        options.startTime = format(new Date(), 'HH:mm');
                        options.startDate = getDateNow();

                        DB.model('Tasks').create(options).then(() => {
                            ctx1.reply('Напоминание создано!')
                        })
                        break;
                    default:
                        break;
                }
            }
        })
    })

    setInterval(() => {
        const date = new Date();
        const thisTime = format(date, 'HH:mm');
        const thisDate = format(date, 'dd.MM.yyyy');

        DB.model('Tasks').findAll({ where: { time: thisTime, date: thisDate, done: false } }).then((result) => {
            result.forEach( item => {
                const { dataValues } = item;
                bot.telegram.sendMessage(dataValues.user_id, dataValues.name, remindControls());
            })
        })

        DB.model('Tasks').update(( { done: true } ), { where: { time: thisTime, date: thisDate } } );
    }, 60000)

    bot.on('callback_query', (ctx) => {
        const callback_id = ctx.update?.callback_query?.id;

        const messageAnswers = {
            Y: 'Отлично!',
            N: 'ОК! Повторим напоминание чуть позже',
            D: 'Отлично! Больше не напоминаю.'
        }
        ctx.reply(messageAnswers[callback_id])
    })

    bot.command('stop', (ctx) => {

    });

    bot.launch();


}, 0)
