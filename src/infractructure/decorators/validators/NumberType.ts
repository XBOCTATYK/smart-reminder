export function NumberType(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        set(value: number) {
            if (isNaN(value)) {
                throw new Error(`SETTER_ERROR ${ propertyKey } ${ value } | TARGET_TYPE=number`)
            }

            target[propertyKey] = value;
        }
    });
}
