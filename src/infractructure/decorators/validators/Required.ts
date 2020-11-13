export function Required(target, propKey) {
    const arrRequiredFields = target.requires;

    if (!arrRequiredFields) {
        Object.defineProperty(target, 'requires', {
            enumerable: false,
            writable: false,
        })
    }

    target.requires.push(propKey);
}
