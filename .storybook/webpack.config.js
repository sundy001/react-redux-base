const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const path = require('path');

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);

    config.resolve.extensions.push(".tsx");
    config.resolve.extensions.push(".ts");
    config.resolve.extensions.push(".scss");

    config.resolve.alias['style-mixin'] = path.join(__dirname, '../src/scss/all');
    config.resolve.alias['components'] = path.join(__dirname, '../src/components');
    config.resolve.alias['scenes'] = path.join(__dirname, '../src/scenes');
    config.resolve.alias['services'] = path.join(__dirname, '../src/services');

    config.module.rules.push({
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
            configFile: path.join(__dirname, '../tsconfig.json'),
        },
    });

    config.module.rules.push({
        test: /.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: [/src/]
    })

    return config;
};
