import { IMatcher, MatchFunc, TransformFunc } from '../interfaces/matcher';

export class Matcher<T> implements IMatcher<T> {
    state: string;
    transformer: TransformFunc<T>;
    matcher: MatchFunc;

    constructor(state: string, match: MatchFunc, transform: TransformFunc<T>) {
        this.state = state;

        if (typeof match !== 'function') {
            throw new Error('matcher must be a function')
        }

        this.matcher = match;

        if (typeof transform !== 'function') {
            throw new Error('transform must be a function')
        }

        this.transformer = transform;
    }

    hasState(state: string) {
        return this.state === state;
    }

    match(text: string): boolean {
        return this.matcher(text);
    }

    transform(text: string): T {
        return this.transform(text);
    }
}
