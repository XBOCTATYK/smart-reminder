import { IUserRepository } from 'Repository/repository.interface';
import { UserDTO } from 'DTO/UserDTO';
import { RepositoryError } from 'Domain/errors';

export class UserRepository implements IUserRepository {
    model: any;

    protected modifiers = {
        id: undefined,
        active: undefined,
    };

    protected saveData = {
        id: undefined
    }

    constructor(db) {
        this.model = db;
    }

    protected ejectData(modelResult) {
        const data = modelResult?.dataValues;

        return data ? new UserDTO(data) : null;
    }

    withId(userId: number) {
        this.modifiers.id = userId;
        this.saveData.id = userId;
        return this;
    }

    active() {
        this.modifiers.active = true;
        return this;
    }

    inactive() {
        this.modifiers.active = false;
        return this;
    }


    async get() {
        const taskList = await this.model.findAll({ where: this.modifiers });
        return taskList.map(task => this.ejectData(task));
    }

    protected mapDTO(userDTO: UserDTO) {
        return {
            startTime: userDTO.startTime,
            endTime: userDTO.endTime,
            timezone: userDTO.timezone,
        }
    }

    protected checkDTO(userDTO: UserDTO) {
        const consistence = userDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError('User Repository. UserDTO is not consistent!');
        }
    }

    async save(userDTO: UserDTO) {
        await this.model.update(
            this.mapDTO(userDTO), {
            where: this.modifiers
        })

        return true;
    }

    async create(userDTO: UserDTO) {
        this.checkDTO(userDTO)
        await this.model.create({
            id: this.saveData.id || userDTO.id,
            ...this.mapDTO(userDTO)
        })

        return true;
    }

    async remove() {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
