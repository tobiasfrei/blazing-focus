const path = require('path');
const glob = require('glob');

const basePath = process.cwd();
const isDev = (process.env.NODE_ENV === 'dev');

const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const {
  VueLoaderPlugin
} = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const nunjucksContext = require('./src/config/index');
const nunjucksDevConfig = require('./src/config/config.dev.json');
const nunjucksProdConfig = require('./src/config/config.prod.json');

nunjucksContext.config = (isDev) ? nunjucksDevConfig : nunjucksProdConfig;

const nunjucksOptions = JSON.stringify({
  searchPaths: `${basePath}/src/`,
  context: nunjucksContext,
});

const htmlTemplates = glob.sync('**/*.njk', {
  cwd: path.join(basePath, 'src/pages/'),
  root: '/',
}).map(page => new HtmlWebpackPlugin({
  filename: page.replace('njk', 'html'),
  template: `src/pages/${page}`,
}));


module.exports = {
  entry: {
    main: './src/assets/js/main.js',
  },
  output: {
    devtoolLineToLine: true,
    sourceMapFilename: 'js/main.js.map',
    path: path.resolve(__dirname, 'demo'),
    pathinfo: true,
    filename: 'js/main.js',
    chunkFilename: 'js/async/[name].chunk.js',
    publicPath: '',
  },
  module: {
    rules: [{
        test: /\.(config.js)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'js/',
          },
        }],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]',
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !isDev,
            },
          },
        ],
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: ['html-loader', `nunjucks-html-loader?${nunjucksOptions}`],
      },
      {
        test: /modernizrrc\.js$/,
        loader: 'expose-loader?Modernizr!webpack-modernizr-loader',
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer'), // eslint-disable-line
              ],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '/fonts/',
          },
        }],
      }
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/demo/vue.esm.js',
    },
  },
  plugins: [
    ...htmlTemplates,
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new WebpackNotifierPlugin(),
    new CleanWebpackPlugin(['demo', 'dist'], {
      root: path.resolve(__dirname),
    }),
    new CopyWebpackPlugin([{
        from: 'src/assets/images/renditions/**/*.{png,gif,jpg,svg}',
        to: 'images/',
        flatten: true,
      },
      {
        from: 'src/modules/blazing-focus/*.js',
        to: '../dist/',
        flatten: true,
      }
    ], {}),
    new SVGSpritemapPlugin({
      src: path.resolve(__dirname, 'src/assets/images/icons/**/*.svg'),
      styles: path.resolve(__dirname, 'src/assets/styles/tools/_svg-sprite.scss'),
      filename: 'images/sprites/svg-sprite.svg',
      gutter: 3,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
  },
};
