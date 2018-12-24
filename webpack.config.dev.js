const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

  devtool: 'eval',

  plugins: [
    new BrowserSyncPlugin({
      /* proxy: 'https://cms.local', */
      server: {
        baseDir: ['demo']
      },
      port: 1712,
      files: ['css/*.css', 'js/*.js', '**/*.njk'],
      open: true,
      https: false,
      notify: false,
      logConnections: true,
      reloadOnRestart: true,
      injectChanges: true,
      online: true,
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false,
      }
    })
  ]
});
