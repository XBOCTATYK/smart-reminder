import { Sequelize, DataTypes, Model } from 'sequelize';
import { OrmModelCollection } from 'Src/db/orm-connection';
import { ModelKey } from 'Constants/enitityNames';

export function getUserModel(sequelize: Sequelize, models?: OrmModelCollection, key?: ModelKey) {
    class User extends Model {
        dataValues: any;
    }

    const TABLE_NAME = 'users'

    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        time_from: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time_to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            defaultValue: 100,
        }

    }, {
        sequelize,
        tableName: TABLE_NAME,
        modelName: key,
        indexes: [{name: `${TABLE_NAME}_id_i`, fields: ["id"]}]
    })

    return User;
}

