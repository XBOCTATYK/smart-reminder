import Model from 'sequelize';
import { TaskDTO } from '../DTO/TaskDTO';

export interface IRepository {
    model: typeof Model;

}

export interface ITaskRepository extends IRepository {
    findOne(id: number): TaskDTO
    findAll(userId: number): TaskDTO[]

}
