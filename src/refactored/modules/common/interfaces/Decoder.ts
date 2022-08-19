export interface Decoder {
    decode<T>(input: string): T
    encode<T>(input: T): string
}