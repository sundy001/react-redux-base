import { injectable, inject, optional } from "inversify";
import IdGeneratorInterface from './IDGeneratorInterface'

@injectable()
export default class IdGenerator implements IdGeneratorInterface  {
    constructor(
        @inject('idGeneratorInitlizeId') @optional() private readonly initlizeId: number = 1,
        @inject('idStore') @optional() private readonly idStore: { [ entityName: string ]: number } = {},
    ) {
    }

    generate(entityName: string): string {
        if (this.idStore[entityName] === undefined) {
            this.idStore[entityName] = this.initlizeId;
        }

        return `${entityName}${this.idStore[entityName]++}`;
    }
}
