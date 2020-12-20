export function SkipNullableSetter(target, propertyKey, descriptor) {
    const method = descriptor.value;

    descriptor.value = function (arg) {
        if (!arg) return this;

        console.log(arg)
        return method.apply(this, [arg]);
    }
}
