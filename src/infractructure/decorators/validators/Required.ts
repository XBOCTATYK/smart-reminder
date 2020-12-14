/**
 * Помечает поле как обязательное и дает метод, который позволяет проверить
 * @param target
 * @param propKey
 * @constructor
 */
export function Required(target, propKey) {
    const arrRequiredFields = target?.requires;

    if (!arrRequiredFields) {
        Object.defineProperty(target, 'requires', {
            enumerable: false,
            writable: false,
            value: []
        })

        target.checkRequires = function () {
            let valid = true;

            target.requires.forEach( item => {
                if (this[item] === undefined || this[item] === null) {
                    valid = false;
                }
            })

            return valid;
        }
    }

    target.requires.push(propKey);
}
