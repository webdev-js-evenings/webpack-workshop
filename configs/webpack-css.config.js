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
                test: /\.cssm$/,
                loader: args.production ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize?modules') : 'style!css?modules',
            },
            {
                test: /\.css$/,
                loader: args.production ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize') : 'style!css',
                //loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.sass$/,
                loader: 'style-loader!css-loader?minimize!autoprefixer-loader?browsers=last 2 version!sass-loader?indentedSyntax'
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
