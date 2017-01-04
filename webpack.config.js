/* @flow */
const ClosureCompilerPlugin = require('webpack-closure-compiler')
const webpack = require('webpack')
const path = require('path')
const version = require('./package.json').version

const date = new Date()

module.exports = {
  entry: {
    'agent': path.join(__dirname, 'src/index.js')
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' }
    ]
  },
  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        compilation_level: 'ADVANCED'
      },
      concurrency: 3
    }),
    new webpack.BannerPlugin(`@userdive/agent.js ${version} | Copyright (c) ${date.getFullYear()} UNCOVER TRUTH Inc.`)
  ]
}
