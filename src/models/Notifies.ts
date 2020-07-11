import { DataTypes, ModelType, Model } from 'sequelize';

export function getNotifiesModel(sequelize, models): ModelType {
    class Notifies extends Model {}

    const TaskModel = models?.Tasks;

    Notifies.init({
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
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        sequelize,
        tableName: 'notifies',
        modelName: 'Notifies'
    })

    return Notifies;
}

