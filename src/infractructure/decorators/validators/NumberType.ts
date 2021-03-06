import { createValidatingDecorator } from 'Decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

export const NumberType = createValidatingDecorator<number>((value) => isNaN(value), `${SETTER_ERRORS.TARGET_TYPE}=NUMBER`)



