declare namespace app {

    namespace store {
        type IdStore<T extends Entity> = {
            [id: string]: T;
        }

        type Store<T extends Entity> =  {
            byId: IdStore<T>;
            allIds: string[];
            idCounter: number;
        }

        type ReadonlyIdStore<T> = {
            readonly[id: string]: T;
        }

        type ReadonlyStore<T> =  {
            readonly byId: ReadonlyIdStore<T>;
            readonly allIds: ReadonlyArray<string>;
            readonly idCounter: number;
        }

        interface Entity {
            id: string;
        }

        interface GenericId {
            readonly type: string;
            readonly id: string;
        }
    }
}
