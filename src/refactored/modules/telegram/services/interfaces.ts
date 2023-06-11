export interface Matcher<T> {
    isMatching(text: string): boolean
    selectData(text: string): T
    name: string
}