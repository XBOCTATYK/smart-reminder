import { createValidatingDecorator } from 'Src/infractructure/decorators/validators/createValidatingDecorator';

export const Positive = createValidatingDecorator<number>((value) => (value < 0), 'VALUE_MUST_BE_POSITIVE')
