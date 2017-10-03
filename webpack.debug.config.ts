import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import webpackConfig from './webpack.config';

const webpackTestConfig: Configuration = webpackMerge(webpackConfig, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {test: /\.(js|ts)$/, exclude: /node_modules/, enforce: 'post', use: 'istanbul-instrumenter-loader'}
        ]
    }
});
