import { IStateMachine } from './state-machine.interface';
import { User } from '../domain/entities/User';
import { Shape } from '../types/shape';
import { MemoryRepository } from '../infractructure/repository/memory.repository';

interface IRestoreUIInfo {
    id: string;
    data: Shape<any>;
    state: string;
}

export class UserUi {
    id: number;
    data: User;
    stateMachine: IStateMachine;
    static repository: MemoryRepository<any>;

    constructor({ id, data, state }) {
        this.id = id;
        this.data = new User(data);
        this.stateMachine.init(state);
    }

    interact(text: string) {

    }

    static async store(instance: UserUi) {
        await UserUi.repository.create({ ...instance.data, id: instance.id })
    }

    static async restore(id: string) {
        const data = await UserUi.repository.withId(id).get()
        return new UserUi(data);
    }
}
