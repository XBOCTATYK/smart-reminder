import { UserRepository } from 'Repository/user.repository';
import { User } from 'Domain/entities/User';
import { UserStoryError } from 'Domain/errors';
import { USER_STORY_ERROR } from 'Constants/errors';
import { UserDTO } from 'DTO/UserDTO';

import { BanListCases } from '../ban-list/ban-list-cases';
import { IUserCases } from './user-cases.interface';
import { IUserRepository } from 'Repository/repository.interface';

export class UserCases implements IUserCases {
    userRepository: IUserRepository;
    banListInteractor: BanListCases;

    constructor(
        userRepository: IUserRepository,
        banListInteractor: BanListCases,
    ) {
        this.userRepository = userRepository;
        this.banListInteractor = banListInteractor;
    }

    protected async getActiveUser(userId: number) {
        const userEntity = new User(userId);
        const banList = await this.banListInteractor.getBanList();

        banList.hasUserInList(userEntity);

        if (userEntity.isBanned) {
            throw new UserStoryError(USER_STORY_ERROR.USER_BANNED)
        }

        return userEntity;
    }

    protected async findUser(userId: number) {
        const [user] = await this.userRepository.withId(userId).get();

        if (!user) {
            throw new UserStoryError(USER_STORY_ERROR.USER_DOESNT_EXISTS);
        }

        const userEntity = this.getActiveUser(userId);
        return new UserDTO(user);
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

            throw new UserStoryError(USER_STORY_ERROR.USER_ALREADY_EXISTS);
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

    async changeTimezone(userId: number, timezone: number): Promise<boolean> {
        try {
            const userDTO = await this.findUser(userId);

            userDTO.setTimezone(timezone);
            await this.userRepository.withId(userId).save(userDTO);

            return true;
        } catch (e) {
            return false;
        }
    }

    async delete(userId: number): Promise<boolean> {
        try {
            const userDTO = await this.findUser(userId);

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
            const userDTO = await this.findUser(userId);

            userDTO.setActive(true);
            await this.userRepository.withId(userId).save(userDTO);
        } catch (e) {
            return false;
        }
    }

    async stop(userId: number): Promise<boolean> {
        try {
            const userDTO = await this.findUser(userId);

            userDTO.setActive(false);
            await this.userRepository.withId(userId).save(userDTO);
        } catch (e) {
            return false;
        }
    }

    async checkUser(userId: number): Promise<UserDTO> {
        try {
            const user = await this.findUser(userId);
            return user;
        } catch (e) {
            return null;
        }
    }

}
