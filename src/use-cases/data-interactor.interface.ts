import { IUserRepository } from 'Repository/repository.interface';

export interface IDataInteractor {
    userRepository: IUserRepository;
}
