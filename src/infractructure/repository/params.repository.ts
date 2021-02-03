import { AbstractRepository } from './abstract.repository';
import { ParamsDTO } from '../DTO/ParamsDTO';
import { IRepository } from './repository.interface';

export interface IParamsRepository extends IRepository<ParamsDTO>{
    withKey(key: string): IParamsRepository;
}

export class ParamsRepository extends AbstractRepository<ParamsDTO> {
    modifiers = {};

    withKey(key: string) {
        this.modifiers[key] = key;

        return this;
    }
}
