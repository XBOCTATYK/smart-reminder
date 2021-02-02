import { UserDTO } from 'DTO/UserDTO';
import { UserRepository } from 'Repository/user.repository';

import { IDataInteractor } from '../data-interactor.interface';

export interface IUserCases extends IDataInteractor {
    userRepository: UserRepository;

    addUser(userInfo: UserDTO): Promise<boolean>;
    stop(userId: number): Promise<boolean>;
    start(userId: number): Promise<boolean>;
    delete(userId: number): Promise<boolean>;
    getParams(userId: number): Promise<UserDTO>;
    changeTimezone(userId: number, timezone: number): Promise<boolean>;
    changeStartTime(time: Date): Promise<boolean>;
    changeEndTime(time: Date): Promise<boolean>;
    changeSomeParams(params: UserDTO): Promise<boolean>;
    checkUser(userId: number): Promise<UserDTO>;
}


