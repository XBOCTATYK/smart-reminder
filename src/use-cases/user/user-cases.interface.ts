import { IDataInteractor } from '../data-interactor.interface';
import { IRepository } from '../../infractructure/repository/repository.interface';
import { UserDTO } from '../../infractructure/DTO/UserDTO';

type UserInfo = {
    id: number;
    startTime: Date;
    endTime: Date;
}

export interface IUserCases extends IDataInteractor {
    repository: IRepository;

    addUser(userInfo: UserInfo): Promise<boolean>;
    stop(userId: number): Promise<boolean>;
    start(userId: number): Promise<boolean>;
    delete(userId: number): Promise<boolean>;
    getParams(userId: number): Promise<UserDTO>;
    changeTimezone(timezone: number): Promise<boolean>;
    changeStartTime(time: Date): Promise<boolean>;
    changeEndTime(time: Date): Promise<boolean>;
    changeSomeParams(params: UserDTO): Promise<boolean>;
}
