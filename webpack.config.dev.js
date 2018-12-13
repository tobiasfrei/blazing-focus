const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

  devtool: 'eval',

  plugins: [
    new BrowserSyncPlugin({
      /* proxy: 'https://cms.local', */
      server: {
        baseDir: ['dist']
      },
      port: 1712,
      files: ['css/*.css', 'js/*.js', '**/*.njk'],
      open: true,
      https: true,
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
