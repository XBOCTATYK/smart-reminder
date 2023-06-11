export interface IMinimalContext {}

export interface ITelegramMessager {
    sendMessage: (string: string, controls: object) => Promise<any>;
}
