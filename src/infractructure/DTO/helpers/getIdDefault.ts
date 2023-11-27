import { takesFirstArgument } from 'Utils/functions/first-argument';

import { IHavingUnicId } from '../../interfaces/main';

export function getIdDefault<T extends IHavingUnicId>() {
    return takesFirstArgument<T, string>(data => data.id)
}
