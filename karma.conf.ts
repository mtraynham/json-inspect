import {Config} from 'karma';
import webpackConfig from './webpack.test.config';

export default function (config: Config): void {
    config.set({
        files: [
            './index.spec.ts'
        ],
        browsers: [
            'ChromeHeadless'
        ],
        singleRun: true,
        frameworks: [
            'jasmine'
        ],
        preprocessors: {
            'src/index.spec.ts': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddlewareOptions: {
            noInfo: true
        },
        reporters: [
            'spec'
        ]
    });
}
