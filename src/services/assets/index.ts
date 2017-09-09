export const assertEntityExist = (
    storeName: string,
    store: app.store.ReadonlyStore<any>,
    id: string,
): void => {
    if (store.byId[id] === undefined) {
        throw new Error(`Id "${id}" is not found in ${storeName}.byId`);
    }

    if (store.allIds.indexOf(id) === -1) {
        throw new Error(`Id "${id}" is not found in ${storeName}.allIds`);
    }
};

export const assertEntitiesExist = (
    storeName: string,
    store: app.store.ReadonlyStore<any>,
    ids: ReadonlyArray<string>,
): void => {
    if (ids.length === 0) {
        return;
    }

    const idMap: {[id: string]: boolean} = {};
    store.allIds.forEach(id => {
        idMap[id] = true;
    });

    ids.forEach(id => {
        if (store.byId[id] === undefined) {
            throw new Error(`Id "${id}" is not found in ${storeName}.byId`);
        }

        if (idMap[id] === undefined) {
            throw new Error(`Id "${id}" is not found in ${storeName}.allIds`);
        }
    });
};
