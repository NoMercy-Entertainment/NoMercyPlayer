const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'client'),
    devtool: 'inline-source-map',
    entry: './main.tsx',
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'static/js')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};