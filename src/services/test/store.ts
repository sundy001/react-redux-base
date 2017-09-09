import { cloneDeep } from 'lodash';

export function createAddExpectation<T extends app.store.Entity>(
    store: app.store.ReadonlyStore<T>,
    newEntity: T
): app.store.ReadonlyStore<T> {
    const expectation = cloneDeep(store) as app.store.Store<T>;
    expectation.byId[newEntity.id] = newEntity;
    expectation.allIds.push(newEntity.id);

    return expectation;
}

export function storeShouldBeImmutable<T, U>(
    this: {store: app.store.ReadonlyStore<U>},
    reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
    action: T
): void {
    it('should return new state', () => {
        const result = reducer(this.store, action);

        expect(result).not.toBe(this.store);
    });

    it('should return different object of byId', () => {
        const result = reducer(this.store, action);

        expect(result.byId).not.toBe(this.store.byId);
    });

    it('should return different object of allIds', () => {
        const result = reducer(this.store, action);

        expect(result.allIds).not.toBe(this.store.allIds);
    });
}

export function storeByIdShouldBeImmutable<T, U>(
    this: {store: app.store.ReadonlyStore<U>},
    reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
    action: T
): void {
    it('should return new state', () => {
        const result = reducer(this.store, action);

        expect(result).not.toBe(this.store);
    });

    it('should return different object of byId', () => {
        const result = reducer(this.store, action);

        expect(result.byId).not.toBe(this.store.byId);
    });
}

export function storeAllIdsShouldBeImmutable<T, U>(
    this: {store: app.store.ReadonlyStore<U>},
    reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
    action: T
): void {
    it('should return new state', () => {
        const result = reducer(this.store, action);

        expect(result).not.toBe(this.store);
    });

    it('should return different object of allIds', () => {
        const result = reducer(this.store, action);

        expect(result.allIds).not.toBe(this.store.allIds);
    });
}

export function entityNotFoundShouldThrowError<T, U>(
    this: {store: app.store.ReadonlyStore<U>},
    reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
    action: T
): void {
    it('should throw error when id is not exist in byId', () => {
        const reducerWrapper = () => {
            reducer(this.store, action);
        };

        expect(reducerWrapper).toThrowError(/is not found in/);
    });

    it('should throw error when id is not exist in allIds', () => {
        const reducerWrapper = () => {
            reducer(this.store, action);
        };

        expect(reducerWrapper).toThrowError(/is not found in/);
    });
}
