import { DataTypes, Model, ModelType } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';
import { ModelKey, TASK_ENTITY_KEY } from 'Constants/enitityNames';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getUsualModel(sequelize, models?: OrmModelCollection, key?: ModelKey): ModelType {
    class Usual extends Model {}

    const TaskModel = getTasksModel(sequelize, models, TASK_ENTITY_KEY);

    Usual.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        task_id: {
            type: DataTypes.UUID,
            references: {
                model: TaskModel,
                key: 'id'
            }
        },
        days: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        hours: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        minutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        lastTaskDate: {
            type: DataTypes.STRING(12),
            defaultValue: null,
        },
        lastTaskTime: {
            type: DataTypes.STRING(5),
            defaultValue: null,
        },

    }, {
        sequelize,
        tableName: 'usual',
        modelName: key
    })

    Usual.belongsTo(TaskModel, {
        foreignKey: 'task_id'
    });

    return Usual;
}

