import { ICheckRequired } from 'Src/infractructure/interfaces/main';
import { createValidatingDecorator } from 'Src/infractructure/decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

export const DTO = createValidatingDecorator<ICheckRequired>((value) => !value.checkRequires(), `${SETTER_ERRORS.TARGET_TYPE}=DTO`)
