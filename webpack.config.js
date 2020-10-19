const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = Path.resolve(__dirname, './src');
const dist = Path.resolve(__dirname, './dist');

const config = {
    entry: Path.resolve(src, 'index.js'),
    output: {
        path: dist,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(png|gif|jpg|svg)$/, use: ['file-loader'] }
        ]
    },
    plugins: [new HtmlWebpackPlugin({ template: 'index.html' })],
    performance: {
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000
    },
    devServer: {
        contentBase: dist,
        compress: true,
        port: 1234
    }
}

module.exports = config;
