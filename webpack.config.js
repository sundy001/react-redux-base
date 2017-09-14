const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        app: './src/app.tsx',
        libs: ['react', 'react-dom'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss'],
        alias: {
            'style-mixin': path.join(__dirname, '/src/scss/all'),
            'app': path.join(__dirname, '/src'),
            'components': path.join(__dirname, '/src/components'),
            'scenes': path.join(__dirname, '/src/scenes'),
            'services': path.join(__dirname, '/src/services'),
        }
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }],
                    // use style-loader in development
                    // creates style nodes from JS strings
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libs',
        }),
        extractSass,
    ],
    // devtool: 'eval',
    devServer: {
        contentBase: __dirname,
        host: '0.0.0.0',
        disableHostCheck: true,
    },
}
