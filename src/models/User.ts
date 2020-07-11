import { DataTypes, ModelType, Model } from 'sequelize';

export function getUserModel(sequelize): ModelType {
    class User extends Model {}

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
        modelName: 'User'
    })

    return User;
}

