export class AbstractService {
    protected id: number;
    protected valueProp: any;

    addData: (data: any) => AbstractService;
    value: () => any;
}
