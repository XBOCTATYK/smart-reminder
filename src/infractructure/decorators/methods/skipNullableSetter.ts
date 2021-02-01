export function SkipNullableSetter(target, propertyKey: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = function (arg) {
        if (!arg) return this;

        return method.apply(this, [arg]);
    }
}
