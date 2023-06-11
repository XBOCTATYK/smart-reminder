import RU from 'date-fns/locale/ru';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const TIME_FORMAT = 'HH:mm';
export const FULL_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const LOCALE = RU;

export const DATE_FNS_OPTIONS = {
    locale: LOCALE,
    startOfWeek: 1,
}

export type DateFnsOptions = {
    locale: Locale;
    startOfWeek: number;
}
