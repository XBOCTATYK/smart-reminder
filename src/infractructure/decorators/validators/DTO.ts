export function DTO(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        set(value) {
            if (value.isConsistent) {
                target[propertyKey] = value;
            } else {
                throw new Error(`SETTER_ERROR ${ propertyKey } ${ value } | TARGET_TYPE=DTO`)
            }
        }
    });
}
