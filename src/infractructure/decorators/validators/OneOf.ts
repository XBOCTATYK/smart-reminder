import { createValidatingDecorator } from './createValidatingDecorator';
import { SETTER_ERRORS } from '../../../constants/errors';

export const OneOf = function (array) {
    return createValidatingDecorator<any[]>((value) => array.includes(value), `${SETTER_ERRORS.VALUE_MUST_BE}=${array.toString()}`);
}
