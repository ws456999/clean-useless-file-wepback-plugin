const fs = require('fs');
const path = require("path")
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const publicPath = ".";
const UselessFile = require('../../index')

const devConfig = () => {
  const plugins = [
      new UselessFile({
        root: './src', // 项目目录
        out: './fileList.json', // 输出文件列表
        // out?: (files) => deal(files), // 或者回调处理
        // clean?: false, // 删除文件,
        exclude: [
          /blitz/g,
          // 'blitz-container'
        ] // 排除文件列表, 格式为文件路径数组
      }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackTagsPlugin({
            files: ['index.html'],
            scripts: 'dll/dll_vendor.js',
            append: false,
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.resolve(__dirname, '../dll/dev/vendor-manifest.json'),
        }),
        new webpack.DefinePlugin({
          BLITZ_SPRITE_MODIFIED_TIMESTAMP: JSON.stringify(
            getBlitzSpriteModifiedTimestamp() || ''
          ),
        })
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

function getBlitzSpriteModifiedTimestamp() {
  const p = path.resolve(
    __dirname,
    '../node_modules/@salesforce-ux/design-system/assets/icons/blitz-sprite/svg/symbols.svg'
  );
  const stats = fs.statSync(p);
  const ret = stats.mtime.getTime();
  console.log('BLITZ_SPRITE_MODIFIED_TIMESTAMP:', ret);
  return ret;
}

module.exports = merge(commonConfig, devConfig());
