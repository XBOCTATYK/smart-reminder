import { DataTypes, ModelType, Model } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';
import { ModelKey } from 'Constants/enitityNames';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getNotifiesModel(sequelize, models?: OrmModelCollection, key?: ModelKey): ModelType {
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
        modelName: key
    });

    // @ts-ignore
    Notifies.belongsTo(TaskModel, {
        foreignKey: 'task_id'
    });

    return Notifies;
}

