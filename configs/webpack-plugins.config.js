var webpack = require('webpack')

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var yargs = require('yargs')

var args = yargs
    .alias('p', 'production')
    .argv


module.exports = {
    debug: !args.production, //nastavuje mod loaderům
    devtool: 'source-map', //generovaný kod, eval-source-map - originální kod
    //https://webpack.github.io/docs/configuration.html#debug
    resolve: {
        extensions: ['', '.css', '.js'],
        alias: {
            //'modules': path.resolve('./modules')
        },
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          screw_ie8: true,
          warnings: false,
        },
        comments: false,
      }),
      new ExtractTextPlugin('style.css', { allChunks: true }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(args.production ? 'production' : 'development')
        },
        '__DEVTOOLS__': !args.production,
        '__DEV__': !args.production,
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
    ],
    entry: args.production ? './src/plugins.js' : [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      './src/plugins.js',
    ],
    output: {
        path: './dist/',
        'filename': 'bundle.js',
    }
}
