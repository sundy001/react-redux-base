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

export const shouldBeImmutable = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
    return <T>(
        reducer: (state: app.store.ReadonlyStore<U>, action: T) => app.store.ReadonlyStore<U>,
        action: T,
        paths: ReadonlyArray<string>,
        state?: string,
    ): void  => {
        const testedPathsMap: {[path: string]: boolean} = {};

        const stateDesc = state === undefined ? '' : ' ' + state;

        it(`should be immutable at store${stateDesc}`, () => {
            const result = reducer(self.store, action);
            expect(result).not.toBe(self.store);
        });

        paths.forEach(path => {
            let testPath = '';
            path.split('.').forEach(partialPath => {
                testPath += testPath === ''
                    ? partialPath
                    : '.' + partialPath
                ;

                if (testedPathsMap[testPath]) {
                    return;
                }

                testedPathsMap[testPath] = true;

                console.log(testPath);
                it(`should be immutable at ${testPath}${stateDesc}`, () => {
                    const result = reducer(self.store, action);
                    expect(get(result, testPath)).not.toBe(get(self.store, testPath));
                });
            })
        });
    }
};

export const shouldThrowErrorWhenEntityNotFound = <U>(self: {store: app.store.ReadonlyStore<U>}) => {
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
};
