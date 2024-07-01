const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const ExternalRemotesPlugin = require('external-remotes-plugin');

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: 'auto',
    },
    devServer: {
        // port: 8081,
        historyApiFallback: true,
    },
    optimization: {
        minimize: true,
        runtimeChunk: false,
        splitChunks: false
    },
    plugins: [
        { // anonymous plugin
            apply(compiler) {
              compiler.hooks.beforeRun.tapAsync('MyCustomBeforeRunPlugin', function(compiler, callback) {
                // debugger
                // console.dir(compiler.options)
                callback()
              })
            },
        },
        new ModuleFederationPlugin({
            name: 'container',
            filename: 'remoteEntry.js',
            exposes: {},
            remotes: {
                dtk: 'storybook@https://dtk.suncoast.systems/remoteEntry.js',
            },
            shared: {
                ...packageJson.dependencies,
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                }
            }
        }),
        new ExternalRemotesPlugin()
    ],
};

module.exports = (env) => merge(commonConfig(env), prodConfig);