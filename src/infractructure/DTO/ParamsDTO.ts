import { SkipNullableSetter } from '../decorators/methods/skipNullableSetter';
import { IConsistent } from '../interfaces/main';

export class ParamsDTO implements IConsistent {
    id: string;
    key: string;
    value: string;

    constructor({ key, value }) {
        this.setKey(key);
        this.setValue(value);
    }

    @SkipNullableSetter
    setKey(key: string) {
        this.key = key;
    }

    @SkipNullableSetter
    setValue(value: string) {
        this.value = value;
    }

    checkConsistence(): boolean {
        return true;
    }
}
