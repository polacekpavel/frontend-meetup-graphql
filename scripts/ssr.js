const path = require('path');
const express = require('express');
const webpack = require('webpack');
const app = express();
const config = require('../config/webpack.config.dev.ssr')

const compiler = webpack(config);
const buildFile = path.resolve(__dirname, '../buildSSR/static/js/bundle.js');

compiler.watch({}, (err) => {
  if(err) {
    console.error(err);
  }
  delete require.cache[buildFile];
});

app.use('/', (req, res, next) => {
  try {
    require(buildFile).default(req, res, next)
  } catch (error) {
    console.error(error.stack)
  }
});

module.exports = app;