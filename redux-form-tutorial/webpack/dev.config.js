const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(baseConfig, {
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'eval-source-map',
    output: {
        publicPath: "/"
    },

    devServer: {
        inline: true,
        host: '000.000.00.00',
        port: 8080,
        hot: true,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {sourceMap: true},
                        },
                        {
                            loader: 'postcss-loader',
                            options: {config: {path: 'webpack/postcss.config.js'}},
                        },
                    ]
                }),
            },
        ],
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
    ],
});
