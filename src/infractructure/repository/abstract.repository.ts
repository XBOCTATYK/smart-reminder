import { RepositoryError } from 'Domain/errors';
import { IConsistent } from 'Src/infractructure/interfaces/main';
import { AbstractDTO } from 'DTO/AbstractDTO';
import { ModelResult } from 'Types/models';
import { IRepository } from 'Repository/repository.interface';
import { Shape } from 'Types/shape';

export class AbstractRepository<DTO extends IConsistent> implements IRepository<DTO>{
    private name = 'Abstract';
    model = undefined;

    protected modifiers = {};
    protected includedModels = [];

    constructor(model: any) {
        this.model = model;
    }

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

    async get(): Promise<DTO[]> {
        const itemList = await this.model.findAll({ where: this.modifiers, include: this.includedModels });
        return itemList.map(task => this.ejectData(task));
    }

    protected mapDTO(thisDTO: DTO): Shape<any> {
        return { ...thisDTO }
    }

    async save(itemDTO: DTO): Promise<boolean> {
        await this.model.update(this.mapDTO(itemDTO), { where: this.modifiers })

        return true;
    }

    async create(thisDTO: DTO): Promise<boolean> {
        if (Array.isArray(thisDTO)) {
            const mappedEntities = thisDTO.map((DTO) => {
                this.checkDTO(DTO);

                return { ...this.mapDTO(DTO) }
            })

            await this.model.bulkCreate(mappedEntities);

            return true;
        }

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
