export function DateType(target, propertyKey) {
    Object.defineProperty(target, propertyKey, {
        set(value: Date) {
            if (!(value instanceof Date)) {
                throw new Error(`SETTER_ERROR ${ propertyKey } ${ value } | TARGET_TYPE=date`)
            }

            this[`_${ propertyKey }`] = value;
        },
        get(): any {
            return this[`_${ propertyKey }`];
        }
    });
}
