const fs = require('fs');
const path = require("path")
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const publicPath = ".";

const devConfig = () => {
  const plugins = [
        new webpack.HotModuleReplacementPlugin(),
    ];


  return {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
      contentBase: "./build",
      open: true,
      port: 8080,
      hot: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                url: false,
              },
            },
            "less-loader",
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader",
            {
              loader: "css-loader",
              options: {
                url: false,
              }
            }],
        },
      ],
    },
    plugins,
    output: {
      filename: "js/[name].js",
      chunkFilename: "js/[name].js",
      publicPath: publicPath,
    },
  };
};

module.exports = merge(commonConfig, devConfig());
