import { ICheckRequired } from 'Src/infractructure/interfaces/main';
import { SetterError } from 'Src/domain/errors';

export function DTO(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        set(value: ICheckRequired) {
            if (value.checkRequires()) {
                this[`_${ propertyKey }`] = value;
            } else {
                throw new SetterError(`SETTER_ERROR ${ propertyKey } ${ value } | TARGET_TYPE=DTO`)
            }
        },
        get() {
            return this[`_${ propertyKey }`];
        }
    });
}
