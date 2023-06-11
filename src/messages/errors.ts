import { BUSINESS_ERROR, DTO_ERROR, USER_STORY_ERROR } from '../constants/errors';

export const USER_ERROR_MESSAGES = {
    [BUSINESS_ERROR.ANSWER_IS_SETTED]: 'Вы уже давали ответ на это напоминание!',
    [BUSINESS_ERROR.ZERO_PRIORITY]: 'Приоритет не может быть нулевым значением',
    [BUSINESS_ERROR.TOO_HIGH_PRIORITY]: 'Приоритет должен быть числом от 0 до 20',
    [BUSINESS_ERROR.CANNOT_CREATE_NOTIFICATION_TASK_IS_DONE]: 'Невозможно создать уведомление, задача завершена',
    [BUSINESS_ERROR.UNRECOGNIZED_ANSWER]: 'Такого ответа не существует.',
    [DTO_ERROR.TOO_LONG_NAME]: 'Имя не должно превышать 100 символов.',
    [USER_STORY_ERROR.USER_ALREADY_EXISTS]: 'Невозможно зарегистрировать пользователя. Пользователь с таким id уже существует.',
    [USER_STORY_ERROR.USER_DOESNT_EXISTS]: 'Перед работой нужно указать данные пользователя. Наберите команду /start для этого.',
    [USER_STORY_ERROR.USER_BANNED]: 'Вы не можете работать с этим ботом.'
}

export const ADMIN_ERROR_MESSAGES = {
    [BUSINESS_ERROR.ANSWER_IS_SETTED]: 'Это напоминание уже имеет ответ {answer}',
    [BUSINESS_ERROR.ZERO_PRIORITY]: 'Приоритет не может быть нулевым значением',
    [BUSINESS_ERROR.TOO_HIGH_PRIORITY]: 'Приоритет задачи выше допустимого ({max_priority})',
    [BUSINESS_ERROR.CANNOT_CREATE_NOTIFICATION_TASK_IS_DONE]: 'Невозможно создать уведомление, задача завершена',
    [BUSINESS_ERROR.UNRECOGNIZED_ANSWER]: 'Несуществующий ответ.',
    [DTO_ERROR.TOO_LONG_NAME]: 'Имя не должно превышать {max_name} символов.',
    [USER_STORY_ERROR.USER_ALREADY_EXISTS]: 'Невозможно зарегистрировать пользователя. Пользователь с таким id уже существует.',
    [USER_STORY_ERROR.USER_DOESNT_EXISTS]: 'Пользователь не найден.',
    [USER_STORY_ERROR.USER_BANNED]: 'Пользователь в бан-листе.'
}
