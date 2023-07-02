import {Channel} from "../common/interfaces/Channel";
import {Action} from "../common/interfaces/Action";

export type ModuleExports = {
    services: Record<string, any>,
    channels: Record<string, Channel>,
    actionTypes: Action<Record<string, any>>[]
}

export interface PetModule {
    init(): PetModule
    export(): ModuleExports
}