import { DataTypes, ModelType, Model } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';

export function getNotifiesModel(sequelize, models): ModelType {
    class Notifies extends Model {}

    const TaskModel = getTasksModel(sequelize, models);

    Notifies.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        task_id: {
            type: DataTypes.INTEGER,
            references: {
                model: TaskModel,
                key: 'id'
            }
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'notifies',
        modelName: 'Notifies'
    });

    // @ts-ignore
    Notifies.belongsTo(TaskModel, {
        foreignKey: 'task_id'
    });

    return Notifies;
}

