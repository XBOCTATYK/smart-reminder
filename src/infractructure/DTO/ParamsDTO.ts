import { SkipNullableSetter } from 'Decorators/methods/skipNullableSetter';

import { IConsistent, IHavingUnicId } from '../interfaces/main';

export interface IParamsDTO {
    key: string;
    value: string;
}

export class ParamsDTO implements IConsistent, IHavingUnicId {
    id: string;
    key: string;
    value: string;

    constructor({ key, value }: IParamsDTO) {
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
