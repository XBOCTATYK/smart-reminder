import {ModelKey} from "../datasource/constants/enitityNames";
import {Model, Sequelize} from "sequelize";
import {OrmModelCollection} from "../datasource/db/EntitiyMangerSequlize";

export type OrmModelItem = {
    key: ModelKey;
    init: (ormInstance: Sequelize, models?: OrmModelCollection, key?: ModelKey) => typeof Model;
}

export interface EntityManager {
    getEntity<T extends typeof Model>(name: ModelKey): T
    list(): Array<typeof Model>
    addEntity(models: OrmModelItem): EntityManager
    addEntities(models: OrmModelItem[]): EntityManager
}