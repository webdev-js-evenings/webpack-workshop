const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const yargs = require('yargs')

const args = yargs
    .alias('p', 'production')
    .argv


module.exports = {
    debug: !args.production, //nastavuje mod loaderům
    devtool: args.production ? 'source-map' : 'eval-source-map',
    entry: !args.production ? [
        'babel-polyfill',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './src/prod/index.js', 
    ] : [
        'babel-polyfill',
        './src/prod/index.js', 
    ],
    output: {
        path: './dist/',
        'filename': 'bundle.js',
    },
    resolve: {
        extensions: ['', '.css', '.js'],
    },
    plugins: args.production ? [
        new ExtractTextPlugin('style.css', { allChunks: true }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false,
            },
            comments: false,
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(args.production ? 'production' : 'development')
            },
            '__DEVTOOLS__': !args.production,
            '__DEV__': !args.production,
        }),
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
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    'url?limit=25000',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }
        ]
    }
}
