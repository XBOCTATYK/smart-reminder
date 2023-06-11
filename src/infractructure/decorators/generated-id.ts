import { v1 } from 'uuid';
import { valueFunc } from 'Utils/functions/empty-func';

// eslint-disable-next-line @typescript-eslint/ban-types
export function GeneratedId(idMapper: Function = valueFunc) {
    return function <T extends { new (...args: any[]): { } }>(constructor: T) {
        return class extends constructor {
            id: string;
            setId(id) {
                this.id = id || v1();
            }

            constructor(...args) {
                super(...args);

                this.setId(idMapper(...args))
            }
        }
    }
}
