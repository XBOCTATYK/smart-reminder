import { User } from './User';

export class BanList {
    list: number[] = [];

    constructor(list: number[] = []) {
        this.list = list;
    }

    addUser(user: User) {
        this.list.push(user.id)
    }

    hasUserInList(user: User) {
        user.isBanned = this.list.includes(user.id);
    }
}
