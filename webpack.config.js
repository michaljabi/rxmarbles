'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const gitPackage = require('./package.json');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const rxjsVersion = gitPackage.devDependencies.rxjs;

let plugins = [
  new webpack.DefinePlugin({
    RXJS_VERSION: `"${rxjsVersion}"`,
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new CopyWebpackPlugin({
      patterns: [
        { from: 'static', to: './' }
      ]
  }),
]

if (isProduction) {
  plugins = plugins.concat([
    new CleanWebpackPlugin()
  ]);
}

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name]-[hash].js' : '[name].js',
  },

  mode: isProduction ?
    'production' :
    'development',

  devtool: isProduction ?
    'source-map' :
    'inline-source-map',

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: {},
    host: '0.0.0.0',
  },

  plugins,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    ]
  }
};
