import { IDataInteractor } from '../data-interactor.interface';
import { UserDTO } from '../../infractructure/DTO/UserDTO';
import { UserRepository } from '../../infractructure/repository/user.repository';
import { UserStoryError } from '../../domain/errors';
import { User } from '../../domain/entities/User';
import { BanListInteractor } from '../ban-list/ban-list-interactor';

export interface IUserCases extends IDataInteractor {
    userRepository: UserRepository;

    addUser(userInfo: UserDTO): Promise<boolean>;
    stop(userId: number): Promise<boolean>;
    start(userId: number): Promise<boolean>;
    delete(userId: number): Promise<boolean>;
    getParams(userId: number): Promise<UserDTO>;
    changeTimezone(timezone: number): Promise<boolean>;
    changeStartTime(time: Date): Promise<boolean>;
    changeEndTime(time: Date): Promise<boolean>;
    changeSomeParams(params: UserDTO): Promise<boolean>;
}

export class UserCases implements IUserCases {
    userRepository: UserRepository;
    banListInteractor: BanListInteractor;

    protected async getActiveUser(userId: number) {
        const userEntity = new User(userId);
        const banList = await this.banListInteractor.getBanList();

        banList.hasUserInList(userEntity);

        if (userEntity.isBanned) {
            throw new UserStoryError('USER_BANNED')
        }

        return userEntity;
    }

    async addUser(userInfo: any): Promise<boolean> {
        try {
            const [user] = await this.userRepository.withId(userInfo.id).get();

            if (!user) {
                const userEntity = this.getActiveUser(userInfo.id);
                const userDTO = new UserDTO(userInfo);

                userDTO.setActive(true);

                await this.userRepository.create(userDTO);
                return true;
            }

            throw new UserStoryError('USER_EXISTS');
        } catch (e) {
            return false;
        }
    }

    async changeEndTime(time: Date): Promise<boolean> {
        return Promise.resolve(false);
    }

    async changeSomeParams(params: UserDTO): Promise<boolean> {
        return Promise.resolve(false);
    }

    async changeStartTime(time: Date): Promise<boolean> {
        return Promise.resolve(false);
    }

    async changeTimezone(timezone: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    async delete(userId: number): Promise<boolean> {
        try {
            const [user] = await this.userRepository.withId(userId).get();

            if (!user) {
                throw new UserStoryError('USER_DOESNT_EXISTS');
            }

            const userDTO = new UserDTO(user);
            userDTO.setActive(false);

            await this.userRepository.withId(userId).save(userDTO);
            return true;
        } catch (e) {
            return false;
        }
    }

    async getParams(userId: number): Promise<UserDTO> {
        return Promise.resolve(undefined);
    }

    async start(userId: number): Promise<boolean> {
        try {
            const [user] = await this.userRepository.withId(userId).get();

            if (user) {
                const userEntity = this.getActiveUser(userId);
                const userDTO = new UserDTO(user);

                userDTO.setActive(true);

                await this.userRepository.withId(userId).save(userDTO);
            }
        } catch (e) {
            return false;
        }
    }

    async stop(userId: number): Promise<boolean> {
        return Promise.resolve(false);
    }

}
