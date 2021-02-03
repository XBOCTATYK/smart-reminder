import { IParamsRepository } from 'Repository/params.repository';

export class ParamsCases {
    paramsRepository;

    constructor(paramsRepository: IParamsRepository) {
        this.paramsRepository = paramsRepository;
    }

    getList() {
        this.paramsRepository.get();
    }
}
