import { User } from '../../domain/entities/User';
import { BanList } from '../../domain/entities/BanList';

export class BanListCases {
    async getBanList() {
        return new BanList([]);
    }

    async checkUserInBanList(user: User) {
        return false;
    }
}
