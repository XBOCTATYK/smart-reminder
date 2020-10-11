import { DataTypes, ModelType, Model } from 'sequelize';
import { ModelKey } from 'Constants/enitityNames';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getParamsModel(sequelize, models?: OrmModelCollection, key?: ModelKey): ModelType {
    class Params extends Model {}

    Params.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'params',
        modelName: key
    });

    return Params;
}
