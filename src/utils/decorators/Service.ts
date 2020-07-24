/**
 * Декоратор добавляющий типовые методы для класса сущности
 * @param TargetClass
 * @constructor
 */
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

/**
 * Декоратор добавляющий типовые методы для класса списка сущностей
 * @param TargetClass
 * @constructor
 */
export function ServiceList(TargetClass: any) {
    return class ServiceListClass extends TargetClass {
        protected listProp = [];
        private diffNew = [];
        private diffUpdate = [];

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

        value() {
            return this.listProp;
        }

        first() {
            return this.listProp[0];
        }

        last() {
            return this.listProp[this.listProp.length - 1];
        }

        async done() {
            if (this.isChanged) {
                for (let item of this.diffUpdate) {
                    await this.Model.update(item, { where: { id: item.id } });
                }

                await this.Model.bulkCreate(this.diffNew);
            }

            this.Store.del(`${this.cacheNamePrefix}${this.id}`)
        }
    }
}
