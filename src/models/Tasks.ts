import { DataTypes, Model, Sequelize } from 'sequelize';
import { OrmModelCollection } from 'Src/db/orm-connection';
import { ModelKey } from 'Constants/enitityNames';

export function getTasksModel(sequelize: Sequelize, models: OrmModelCollection, key?: ModelKey) {
    class Tasks extends Model {
        dataValues: any;
    }

    const UserModel = models?.User;

    Tasks.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            allowNull: false
        },
        notificationsNeed: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        notificationsDone: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: key.toLowerCase(),
        modelName: key
    })

    return Tasks;
}

