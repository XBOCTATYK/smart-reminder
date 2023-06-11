import { createValidatingDecorator } from 'Decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

export const DateType = createValidatingDecorator<Date>((value) => !(value instanceof Date), `${SETTER_ERRORS.TARGET_TYPE}=DATE`)

