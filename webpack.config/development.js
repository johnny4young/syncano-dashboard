var webpack = require('webpack'),
    config  = require('./common');

config.cache   = true;
config.debug   = true;
config.devtool = 'eval';

config.entry.app.unshift(
  'webpack-dev-server/client?https://localhost:8080',
  'webpack/hot/only-dev-server'
);

config.module.preLoaders.push({
  test: /\.jsx?$/,
  loader: 'eslint',
  exclude: [/node_modules/, /syncano-components/, /material-ui/]
});

config.eslint = {
  formatter: require('eslint-friendly-formatter'),
  configFile: '.eslintrc',
  quiet: true
};

config.plugins.unshift(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({SYNCANO_BASE_URL: "'https://api.syncano.rocks/'"}),
  new webpack.DefinePlugin({SYNCANO_DEMO_APPS_ACCOUNT_KEY: "'f983d5db8d3faf7743bc21d9cabf03794caaa02a'"})
);

config.devServer = {
  publicPath: '/js/',
  contentBase: './dist',
  https: true,
  hot: true,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }
};

module.exports = config;
