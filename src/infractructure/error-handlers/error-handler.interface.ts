export interface IErrorHandler<T extends Error> {
    // action on error
    onError(error: T)
    // case of saving or showing error
    storeError(error: T)
}
