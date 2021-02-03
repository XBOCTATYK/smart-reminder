import { IParamsRepository } from 'Repository/params.repository';

export class ParamsCases {
    paramsRepository;

    constructor(paramsRepository: IParamsRepository) {
        this.paramsRepository = paramsRepository;
    }

    async getList() {
        const result = await this.paramsRepository.get();

        return [ ...result ];
    }
}
