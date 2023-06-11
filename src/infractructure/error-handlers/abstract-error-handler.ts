import { IErrorHandler } from './error-handler.interface';

export class AbstractErrorHandler implements IErrorHandler<Error>{
    onError(error:Error) {
        throw error;
    }

    storeError(error: Error) {
        console.log(error)
    }
}
