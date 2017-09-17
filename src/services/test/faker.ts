import { random } from 'faker';

export const app = {
    entityId(entityName: string, min = 1, max = 20) {
        return `${ entityName }${ random.number({min, max}) }`;
    },

    genericIds(
        type: string,
        minLength = 0,
        maxLength = 10,
        minId = 1,
        maxId = 20,
    ): ReadonlyArray<app.store.GenericId> {
        const length = random.number({min: minLength, max: maxLength});
        const result: app.store.GenericId[] = [];
        for (let i = 0; i < length; i++) {
            result.push({
                type,
                id: app.entityId(type),
            });
        }

        return result;
    },
};
