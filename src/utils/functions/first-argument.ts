export function takesFirstArgument<T = any, K = any>(fn: (arg: T) => K) {
    return function (firstArg: T, ...args: any[]) {
        const first = args[0] as T;

        return fn(first);
    }
}
