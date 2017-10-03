import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import webpackConfig from './webpack.config';

const webpackDebugConfig: Configuration = webpackMerge(webpackConfig, {
    devtool: 'eval'
});

export default webpackDebugConfig;
