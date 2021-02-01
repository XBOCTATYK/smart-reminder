import { createValidatingDecorator } from 'Decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

export const OneOf = function<T = any> (array: T[]): Function {
    return createValidatingDecorator<T>((value) => array.includes(value), `${SETTER_ERRORS.VALUE_MUST_BE}=${array.toString()}`);
}
