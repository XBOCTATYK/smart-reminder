import { SetterError } from '../../../domain/errors';

const DEFAULT_MESSAGE = 'Value is not valid!'

type PredicateFunc<T> = (value: T) => boolean;

export function createValidatingDecorator<T = string>(predicateFunc: PredicateFunc<T>, message = DEFAULT_MESSAGE) {
    return function (target, propertyKey) {
        const setter = Object.getOwnPropertyDescriptor(target, propertyKey)?.set;
        console.log(propertyKey)
        console.log(setter)

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
