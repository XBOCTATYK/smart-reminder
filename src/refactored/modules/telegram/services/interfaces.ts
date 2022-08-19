export interface Matcher<T> {
    isMatching(text: string): boolean
    process(text: string): T
}