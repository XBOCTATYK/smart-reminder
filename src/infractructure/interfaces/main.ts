export interface ICheckRequired {
    checkRequires(): boolean;
}

export interface IConsistent {
    checkConsistence(): boolean;
}

export interface IWithId<T> {
    withId: (id: string) => T;
}

export interface IHavingUnicId<T = string> {
    id?: T;
}
