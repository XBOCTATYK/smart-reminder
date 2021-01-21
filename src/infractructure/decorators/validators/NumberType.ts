import { createValidatingDecorator } from 'Src/infractructure/decorators/validators/createValidatingDecorator';

export const NumberType = createValidatingDecorator<number>((value) => isNaN(value), 'TARGET_TYPE=number')



