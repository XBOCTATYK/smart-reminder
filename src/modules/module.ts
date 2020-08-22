export interface IModule {
    start: (ctx) => boolean;
    task: (ctx) => boolean;
    update: (ctx) => boolean;
    statistic: (ctx) => boolean;
}


export class Module implements IModule {
    start(ctx) {
        return true;
    }

    update(ctx) {
        return true;
    }

    task(ctx) {
        return true;
    }

    statistic(ctx) {
        return true;
    }

}
