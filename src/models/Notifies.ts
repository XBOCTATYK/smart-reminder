import { DataTypes, Model, ModelType } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';
import { ModelKey, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getNotifiesModel(sequelize, models?: OrmModelCollection, key?: ModelKey): ModelType {
    class Notifies extends Model {}

    const TaskModel = getTasksModel(sequelize, models, TASK_ENTITY_KEY);

    Notifies.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        task_id: {
            type: DataTypes.UUID,
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
        tableName: key.toLowerCase(),
        modelName: key
    });

    // @ts-ignore
    Notifies.belongsTo(TaskModel, {
        foreignKey: 'task_id'
    });

    return Notifies;
}

