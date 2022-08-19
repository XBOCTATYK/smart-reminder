import {Decoder} from "../../interfaces/Decoder";

export class JSONDecoder implements Decoder {
    constructor() {}

    decode<T>(input: string): T {
        return JSON.parse(input) as T
    }

    encode<T>(input: T): string {
        return JSON.stringify(input)
    }
}