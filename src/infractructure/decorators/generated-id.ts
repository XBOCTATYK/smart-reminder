import { v1 } from 'uuid';

export function GeneratedId<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        id: string;
        setId() {
            this.id = v1();
        }

        constructor(...args) {
            super(...args);

            this.setId()
        }
    }
}
