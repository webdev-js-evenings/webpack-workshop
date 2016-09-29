const ExtractTextPlugin = require('extract-text-webpack-plugin')
const yargs = require('yargs')

const args = yargs
    .alias('p', 'production')
    .argv


module.exports = {
    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      './src/style.js', 
    ],
    debug: true, //nastavuje mod loaderům
    devtool: 'eval', //generovaný kod, eval-source-map - originální kod
    //https://webpack.github.io/docs/configuration.html#debug
    output: {
        path: './dist/',
        'filename': 'bundle.js',
    },
    plugins: args.production ? [
        new ExtractTextPlugin('style.css', { allChunks: true })
    ] : [],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: args.production ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize?modules') : 'style!css?modules',
            },
        ]
    }
}
