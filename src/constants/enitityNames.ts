/**
 * Уникальные ключи для сущностей проекта
 */

export const USER_ENTITY_KEY = 'User'; // Пользователи
export const TASK_ENTITY_KEY = 'Tasks'; // Задачи
export const NOTIFICATION_ENTITY_KEY = 'Notifies'; // Напоминания
export const USUAL_EVENTS_ENTITY_KEY = 'Usual'; // Планирование периодических задач
export const USER_PARAMS_ENTITY_KEY = 'Params'; // Параметры приложения
export const DONE_TASK_KEY = 'DoneTasks' // Завершенные задачи
export const DONE_NOTIFIES_KEY = 'DoneNotifies' // Завершенные напоминания

export type ModelKey = typeof USER_ENTITY_KEY |
    typeof TASK_ENTITY_KEY |
    typeof NOTIFICATION_ENTITY_KEY |
    typeof USUAL_EVENTS_ENTITY_KEY |
    typeof USER_PARAMS_ENTITY_KEY |
    typeof DONE_TASK_KEY |
    typeof DONE_NOTIFIES_KEY;
