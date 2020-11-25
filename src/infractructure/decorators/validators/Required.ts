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

        target.checkRequires = () => {
            return target.requires;
        }
    }

    target.requires.push(propKey);
}
