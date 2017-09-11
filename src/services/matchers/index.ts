/// <reference types="jest"/>

const comparator = (func: Comparer) =>
    (): jasmine.CustomMatcher => ({
        compare: func
    })
;

export const toBeAwesome = comparator((actual: any, expected: any) => {
    const pass = false;
    const message = () => 'hello world';
    return {pass, message}
});

type Comparer =
    (<T>(actual: T, expected: T) => jasmine.CustomMatcherResult) |
    ((actual: any, expected: any) =>  jasmine.CustomMatcherResult)
