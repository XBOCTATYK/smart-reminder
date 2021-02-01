import { createValidatingDecorator } from 'Decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

export const Positive = createValidatingDecorator<number>((value) => (value < 0), SETTER_ERRORS.VALUE_MUST_BE_POSITIVE);
