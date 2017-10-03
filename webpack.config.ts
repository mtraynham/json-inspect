import {CheckerPlugin} from 'awesome-typescript-loader';
import {readFileSync} from 'fs';
import template from 'lodash/template';
import {join, resolve} from 'path';
import {TslintPlugin} from 'tslint-loader';
import {BannerPlugin, Configuration} from 'webpack';
import pkg from './package.json';

const banner: string = template(readFileSync(join(__dirname, 'LICENSE_BANNER.ts'), 'utf8'))({
    pkg,
    date: new Date()
});
const configuration: Configuration = {
    devtool: 'source-map',
    entry: {
        [pkg.name]: resolve('./index.ts')
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new TslintPlugin(),
        new CheckerPlugin(),
        new BannerPlugin({banner, raw: true})
    ],
    module: {
        rules: [
            {test: /\.ts$/, exclude: /node_modules/, enforce: 'pre', use: {loader: 'tslint-loader', options: {typeCheck: true}}},
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: 'tsconfig.babel.json',
                            useBabel: true,
                            useCache: true,
                            cacheDirectory: './.awcache'
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].js',
        library: pkg.name,
        libraryTarget: 'umd'
    }
};

export default configuration;
