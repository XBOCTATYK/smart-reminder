import { DataTypes, ModelType, Model } from 'sequelize';

export function getUsualModel(sequelize, models): ModelType {
    class Usual extends Model {}

    const TaskModel = models?.Tasks;

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
            allowNull: false
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minutes: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        sequelize,
        tableName: 'usual',
        modelName: 'Usual'
    })

    return Usual;
}

