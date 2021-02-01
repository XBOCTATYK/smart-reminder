import { RepositoryError } from 'Domain/errors';
import { IConsistent } from 'Src/infractructure/interfaces/main';
import { AbstractDTO } from 'DTO/AbstractDTO';
import { ModelResult } from 'Types/models';

export class AbstractRepository<DTO extends IConsistent> {
    name = 'Abstract';
    model = undefined;

    modifiers = {};
    includedModels: [];

    protected checkDTO(thisDTO: DTO): void {
        const consistence = thisDTO.checkConsistence();

        if (!consistence) {
            throw new RepositoryError(`${this.name} Repository. NotificationsDTO is not consistent!`);
        }
    }

    protected ejectData(modelResult: ModelResult): AbstractDTO | null {
        const data = modelResult?.dataValues;

        return data ? new AbstractDTO(data) : null;
    }

    async get() {
        const itemList = await this.model.findAll({ where: this.modifiers, include: this.includedModels });
        return itemList.map(task => this.ejectData(task));
    }

    protected mapDTO(thisDTO: DTO) {
        return { ...thisDTO }
    }

    async save(itemDTO: DTO): Promise<boolean> {
        await this.model.update(this.mapDTO(itemDTO), { where: this.modifiers })

        return true;
    }

    async create(thisDTO: DTO) {
        this.checkDTO(thisDTO);
        await this.model.create({
            ...this.mapDTO(thisDTO)
        })

        return true;
    }

    async remove() {
        this.model.destroy({ where: this.modifiers })

        return true;
    }
}
