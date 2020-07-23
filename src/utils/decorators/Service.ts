export function Service(TargetClass: any) {
    return class ServiceClass extends TargetClass {
        valueProp = {};

        addData(data) {
            this.valueProp = { ...this.valueProp, ...data };
            this.Store.set(`${this.cacheNamePrefix}${this.id}`);

            return this;
        }

        value() {
            return this.valueProp;
        }
    }
}

export function ServiceList(TargetClass: any) {
    return class ServiceClass extends TargetClass {
        protected listProp = [];
        private diffNew = [];
        private diffUpdate = [];

        value() {
            return this.listProp;
        }

        addData(data) {
            if (!data.id) return this;

            const existsIndex = this.listProp.findIndex(item => item.id === data.id);

            if (existsIndex) {
                this.listProp[existsIndex] = { ...this.listProp[existsIndex], ...data };

                const diffUpdateIndex = this.diffUpdate.findIndex(item => item.id === data.id);

                if (diffUpdateIndex) {
                    this.diffUpdate[existsIndex] = { ...this.diffUpdate[existsIndex], ...data };
                } else {
                    const diffNewIndex = this.diffNew.findIndex(item => item.id === data.id);

                    if (diffUpdateIndex) {
                        this.diffNew[diffNewIndex] = { ...this.diffNew[diffNewIndex], ...data };
                    } else {
                        this.diffUpdate.push(data);
                    }
                }
            } else {
                this.listProp.push(existsIndex);
                this.diffNew.push(data);
            }

            this.Store.set(`${this.cacheNamePrefix}${this.id}`, this.listProp);

            return this;
        }
    }
}
