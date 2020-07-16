import { DataTypes, ModelType, Model } from 'sequelize';

export function getTasksModel(sequelize, models): ModelType {
    class Tasks extends Model {}

    const UserModel = models?.User;

    Tasks.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
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
        remembers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        forgets: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        tableName: 'tasks',
        modelName: 'Tasks'
    })

    return Tasks;
}

