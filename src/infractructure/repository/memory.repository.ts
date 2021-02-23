import { IRepository } from './repository.interface';
import { Store } from '../../services/store';
import * as NodeCache from 'node-cache';

export class MemoryRepository<T extends { id: string }> implements IRepository<T, NodeCache> {
    model = Store;
    modifiers = { id: undefined };

    create(data: T | T[]): Promise<boolean> {
        if (Array.isArray(data)) {
            this.model.mset(data.map(item => ({ val: item, key: item.id })));
        } else {
            this.model.set(data.id, data);
        }

        return Promise.resolve(true);
    }

    withId(id: string | string[]) {
        this.modifiers.id = id;

        return this;
    }

    get(): Promise<T[]> {
        const isMultiple = Array.isArray(this.modifiers.id);
        const data = isMultiple
            ? this.model.mget(this.modifiers.id)
            : this.model.get(this.modifiers.id);
        return Promise.resolve(isMultiple ? Object.values(data) : [data]);
    }

    remove(): Promise<boolean> {
        this.model.del(this.modifiers.id)

        return Promise.resolve(true);
    }

    save(data: T): Promise<boolean> {
        const isMultiple = Array.isArray(this.modifiers.id);

        if (isMultiple) {
            this.modifiers.id.forEach( id => {
                const hasKey = this.model.has(id);

                if (hasKey) {
                    this.model.set(id, data)
                }
            })
        } else {
            this.model.set(this.modifiers.id, data);
        }

        return Promise.resolve(true);
    }

}
