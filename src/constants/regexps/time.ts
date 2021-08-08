export const daysRegs = '(день|дня|дней|деньков|денечков|ден|дн$|д$)+';
export const hoursRegs = '(час|часа|часов|часика|часиков|часик|чс$|ч$)+';
export const minutesRegs = '(минуты|минуток|минут|мин$|мн$|м$)+';
export const secondsRegs = '(секунды|секундок|секундочек|секунд|сек$|ск$|с$)+';

export const dayCountReg = '([\\d]+)'
export const hourCountReg = '([\\d]+)'
export const minuteCountReg = '([\\d]+)'
export const secondCountReg = '([\\d]+)'

type Flatten<Type> = Type extends { name: infer Item } ? Item : Type;

const t: Flatten<{ name: number }> = 2;
