import { SETTER_ERRORS } from 'Constants/errors';
import { SetterError } from 'Domain/errors';

const DEFAULT_MESSAGE = SETTER_ERRORS.DATA_IS_NOT_VALID;

type PredicateFunc<T> = (value: T) => boolean;

export function createValidatingDecorator<T = string>(predicateFunc: PredicateFunc<T>, message = DEFAULT_MESSAGE) {
    return function (target, propertyKey: string) {
        const setter = Object.getOwnPropertyDescriptor(target, propertyKey)?.set;

        Object.defineProperty(target, propertyKey, {
            configurable: true,
            set(value: T) {
                if (setter) {
                    setter(value);
                }

                if (predicateFunc(value)) {
                    throw new SetterError(`${ propertyKey }=${ value } | ${ message }`)
                }

                if (this) {
                    this[`_${ propertyKey }`] = value;
                } else {
                    target[`_${ propertyKey }`] = value;
                }
            },
            get(): any {
                return this[`_${ propertyKey }`];
            }
        });
    }
}
