import { createValidatingDecorator } from 'Decorators/validators/createValidatingDecorator';
import { SETTER_ERRORS } from 'Constants/errors';

import { ICheckRequired } from 'Src/infractructure/interfaces/main';

export const DTO = createValidatingDecorator<ICheckRequired>((value) => !value.checkRequires(), `${SETTER_ERRORS.TARGET_TYPE}=DTO`)
