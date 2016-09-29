module.exports = {
    debug: true, //nastavuje mod loaderům
    devtool: 'eval', //generovaný kod, eval-source-map - originální kod
    //https://webpack.github.io/docs/configuration.html#debug
    resolve: {
        extensions: ['', '.css', '.js'],
        alias: {
            //'modules': path.resolve('./modules')
        },
    },
    entry: './src/basic.js',
    output: {
        path: './dist/',
        'filename': 'bundle.js',
    }
}
