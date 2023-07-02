import {Logger} from "pino";
import {EntityManager} from "../common/interfaces/EntityManager";
import {ModuleExports, PetModule} from "../interfaces/PetModule";

export class NotificationsModule implements PetModule {
    constructor(logger: Logger, entityManager: EntityManager) {

    }

    init(): PetModule {
        return undefined;
    }

    export(): ModuleExports {
        return undefined;
    }
}