# Why this project exist?
The purpose of this repository provide reference of large scale react-redux stack.

# Setup
## Install
```bash
# install
npm install
```

## Run Unit Tests
```bash
npm run test
```

## Build
```bash
npm run build
```

# How
## Provide scalable project structure
Modulize structure. Instead of just using functional group, logical group is really good for large scale. So your number of files per directory will no grow like a rocket. Also module are encapsulate in differect directory and explode interface through index.ts. So that even if your module grow hurge, you are always welcome to split it into mulitple files insdie the module directory anytime.

## Typescript Reference
I know sometime Typescript is suck. Sometimes it make you annoying.

I find that using global namesapce properly can reduce a lot of boilerplant code. All modules show their types through `type.d.ts`. All the types declare under `app` namespace, which prvent pollute global namespace, but provide convenient way to get the type without import.

Almsot all object is declare as `readonly` to enforce immutable. I think using immutable.js is a bit outdated. It takes time to learn and also create unnecessary noise within the code. So I prefer to drop it and let typescript to enfore everything is immutable.

## Redux
Nothing special. I follow online common partice to normalize the store like:
```javascript
{
    byId: {
        key1: { ... }
        key2: { ... }
    },
    allIds: ['key1', 'key2']
}
```

## Config Setup Reference
Setup tools are tedious. This project is a good starting point to setup full-stack Typescript environment.

# What library is used?
## Highlighted
- Typescript (in big scale project, you definitely want type-checking)
- React
- Redux
- RxJS (handle async operation)
- inversify (DI container for TS)
- jest(unit test)

# Common Routin
## Add Path Alias
- In `/tsconfig.json` add new path in `compilerOptions.paths`. Let Typescript compiler to know the path, but it will not transform the path to actual path.
- In `/webpack.config.js` add new path in `resolve.alias`. Webapck transpile the path to actual path
- In `/package.json` add new path in `jest.moduleNameMapper`. jest does not use webpack, but only TSC. So it need to add path mapping here.

## Jest configration
All the jest configration is store in `/package.json`, in `jest` object.

You need to aware sever property:

`transform`: transpile Typescript base on `tsconfig.json`
`testRegex`: using regex to select which file is test file
`moduleDirectories`: when moudle path is used (i.e. path without `/` and `./` at the beginning), jest will try to search in those directories

https://facebook.github.io/jest/docs/en/configuration.html
https://github.com/kulshekhar/ts-jest

# TODO
- setup TSLint
- create test converage report
- add script for lint, copy, production build and so on
- write document for README.md
- finish demo page
