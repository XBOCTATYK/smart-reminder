import { IHavingUnicId } from 'Src/infractructure/interfaces/main';

/**
 * Абстрактный объект, который просто сохраняет ключи, которые записаны в конструктор
 */
export class AbstractDTO implements IHavingUnicId {
    id: string;
    constructor(data: Record<string, unknown>) {
        if (typeof data !== "object") return data;

        Object.keys(data).forEach(
            key => {
                this[key] = data[key];
            }
        )
    }
}
