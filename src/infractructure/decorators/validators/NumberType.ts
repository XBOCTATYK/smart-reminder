import { SetterError } from 'Src/domain/errors';

export function NumberType(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        set(value: number) {
            if (isNaN(value)) {
                throw new SetterError(`SETTER_ERROR ${ propertyKey } ${ value } | TARGET_TYPE=number`)
            }

            this[`_${ propertyKey }`] = value;
        },
        get(): any {
            return this[`_${ propertyKey }`];
        }
    });
}
