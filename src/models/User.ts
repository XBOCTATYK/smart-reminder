import { Sequelize, DataTypes, Model } from 'sequelize';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getUserModel(sequelize: Sequelize, models?: OrmModelCollection, key?: Symbol) {
    class User extends Model {
        dataValues: any;
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
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
        tableName: 'users',
        modelName: key.toString()
    })

    return User;
}

