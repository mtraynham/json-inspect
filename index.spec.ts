// NOTE Upstream: This is kind of hack.  If we specify webpack source files in
// the karma config, they'll all get loaded as separate modules which is bad
// for performance and it also tries to add angular to the page multiple times.
// https://github.com/webpack-contrib/karma-webpack/issues/54
// https://github.com/webpack-contrib/karma-webpack/issues/73
import RequireContext = __WebpackModuleApi.RequireContext;

const testsContext: RequireContext = require.context('./', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
