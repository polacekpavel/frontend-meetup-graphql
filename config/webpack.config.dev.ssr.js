var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var findCacheDir = require('find-cache-dir');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');

var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: 'source-map',
  entry: [
    paths.appSsrJs
  ],
  target: 'node',
  output: {
    path: paths.appBuildSSR,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          cacheDirectory: findCacheDir({
            name: 'react-scripts'
          })
        }
      },
      {
        test: /\.css$/,
        loader: 'css?importLoaders=1!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },

  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9'
        ]
      })
    ];
  },
  plugins: [
    new webpack.DefinePlugin(env),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
};
