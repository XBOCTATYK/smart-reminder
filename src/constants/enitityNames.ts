/**
 * Уникальные ключи для сущностей проекта
 */

export const USER_ENTITY_KEY = 'User';
export const TASK_ENTITY_KEY = 'Task';
export const NOTIFICATION_ENTITY_KEY = 'Notification';
export const USUAL_EVENTS_ENTITY_KEY = 'Usual';
export const USER_PARAMS_ENTITY_KEY = 'Params';

export type ModelKey = typeof USER_ENTITY_KEY |
    typeof TASK_ENTITY_KEY |
    typeof NOTIFICATION_ENTITY_KEY |
    typeof USUAL_EVENTS_ENTITY_KEY |
    typeof USER_PARAMS_ENTITY_KEY;
