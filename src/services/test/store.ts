import { cloneDeep, get } from 'lodash';

export function createAddExpectation<T extends app.store.Entity>(
    store: app.store.ReadonlyStore<T>,
    newEntity: T
): app.store.Store<T> {
    const expectation = cloneDeep(store) as app.store.Store<T>;
    expectation.byId[newEntity.id] = newEntity;
    expectation.allIds.push(newEntity.id);

    return expectation;
}

export const storeShouldBeImmutable = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T
    ): void => {
        it('should return new state', () => {
            const result = reducer(self.store, action);

            expect(result).not.toBe(self.store);
        });

        it('should return different object of byId', () => {
            const result = reducer(self.store, action);

            expect(result.byId).not.toBe(self.store.byId);
        });

        it('should return different object of allIds', () => {
            const result = reducer(self.store, action);

            expect(result.allIds).not.toBe(self.store.allIds);
        });
    }
}

export const storeByIdShouldBeImmutable = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T
    ): void => {
        it('should return new state', () => {
            const result = reducer(self.store, action);

            expect(result).not.toBe(self.store);
        });

        it('should return different object of byId', () => {
            const result = reducer(self.store, action);

            expect(result.byId).not.toBe(self.store.byId);
        });
    }
}

export const storeAllIdsShouldBeImmutable = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T
    ): void => {
        it('should return new state', () => {
            const result = reducer(self.store, action);

            expect(result).not.toBe(self.store);
        });

        it('should return different object of allIds', () => {
            const result = reducer(self.store, action);

            expect(result.allIds).not.toBe(self.store.allIds);
        });
    }
}

export const propertyShouldBeImmutable = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T,
        path: string,
    ): void  => {
        it(`should return different object of entity.${path}`, () => {
            const result = reducer(self.store, action);

            expect(get(result.byId, path)).not.toBe(get(self.store.byId, path));
        });
    }
}

export const entityNotFoundShouldThrowError = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T
    ): void => {
        it('should throw error when id is not exist in byId', () => {
            const reducerWrapper = () => {
                reducer(self.store, action);
            };

            expect(reducerWrapper).toThrowError(/is not found in/);
        });

        it('should throw error when id is not exist in allIds', () => {
            const reducerWrapper = () => {
                reducer(self.store, action);
            };

            expect(reducerWrapper).toThrowError(/is not found in/);
        });
    }
}
