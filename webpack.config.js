const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    devtool: 'inline-source-map',
    entry: './index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
              test: /\.css$/i,
              include: path.resolve(__dirname, 'src'),
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    },
    output: {
        filename: 'nomercyplayer.js',
        path: path.resolve(__dirname, 'static')
    },
    resolve: {
        extensions: ['.ts']
    },
};
