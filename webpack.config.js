const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    // resolve: {
    //     alias: {
    //         echarts$: "echarts/src/echarts.js",
    //         echarts: "echarts/src"
    //     }
    // }
};