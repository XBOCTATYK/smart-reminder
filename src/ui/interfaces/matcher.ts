export type TransformFunc<T> = (text: string) => T;
export type MatchFunc = (text: string) => boolean;

export interface IMatcher<T> {
    state: string;
    match: MatchFunc;
    transform: TransformFunc<T>;
}
