import { ICheckRequired } from 'Src/infractructure/interfaces/main';
import { createValidatingDecorator } from 'Src/infractructure/decorators/validators/createValidatingDecorator';

export const DTO = createValidatingDecorator<ICheckRequired>((value) => !value.checkRequires(), 'TARGET_TYPE=DTO')
