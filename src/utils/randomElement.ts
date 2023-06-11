export function randomElement<T>(arr: T[]): T {
    const length = arr.length;
    const index = Math.floor(Math.random()*length)

    return  arr[index];
}
