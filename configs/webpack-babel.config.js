const ExtractTextPlugin = require('extract-text-webpack-plugin')
const yargs = require('yargs')

const args = yargs
    .alias('p', 'production')
    .argv


module.exports = {
    debug: true, //nastavuje mod loaderům
    devtool: 'eval-source-map', //
    //https://webpack.github.io/docs/configuration.html#debug
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './src/babel.js', 
    ],
    output: {
        path: './dist/',
        'filename': 'bundle.js',
    },
    resolve: {
        extensions: ['', '.css', '.js'],
    },
    plugins: args.production ? [
        new ExtractTextPlugin('style.css', { allChunks: true })
    ] : [],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loader: args.production ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize') : 'style!css',
            },
        ]
    }
}
