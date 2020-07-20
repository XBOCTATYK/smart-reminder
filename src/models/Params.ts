import { DataTypes, ModelType, Model } from 'sequelize';

export function getParamsModel(sequelize): ModelType {
    class Params extends Model {}

    Params.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
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
        modelName: 'Params'
    });

    return Params;
}
