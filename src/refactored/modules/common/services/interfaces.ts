import {UserSession} from "../interfaces/UserSession";

export interface Configurable {
    configure(config: Record<string, any>): Configurable
    getConfig(): Record<string, any>
}

export interface MessageService {
    getMessage(key: string): String
}

export interface ResourceLoader {
    load(name?: string): Promise<Record<string, any>>
}

export interface MessageBunchLoader extends  ResourceLoader{
    load(): Promise<Record<string, any>>
}

export interface ConfigLoader extends ResourceLoader {
    load(name?: string): Promise<Record<string, any>>
}

export interface UserSessionService {
    getSessionById(userId: number): Promise<UserSession>
}