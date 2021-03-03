export interface IMinimalContext {}

export interface ITelegramMessager {
    sendMessage: (string) => Promise<any>;
}
