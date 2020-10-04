import { DataTypes, ModelType, Model } from 'sequelize';
import { getTasksModel } from 'Models/Tasks';
import { ModelKey } from 'Constants/enitityNames';
import { OrmModelCollection } from 'Src/db/orm-connection';

export function getUsualModel(sequelize, models?: OrmModelCollection, key?: ModelKey): ModelType {
    class Usual extends Model {}

    const TaskModel = getTasksModel(sequelize, models);

    Usual.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        task_id: {
            type: DataTypes.INTEGER,
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
        }

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

