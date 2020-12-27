const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const publicPath = "https://static.gllue.com/collaborative";

const prodConfig = () => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[name].[hash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'dll/prod',
          to: 'dll/',
        },
        {
          from: 'assets',
          to: 'assets',
        }
      ]
    }),
    new HtmlWebpackTagsPlugin({
        files: ['index.html'],
        scripts: 'dll/dll_vendor.js',
        append: false,
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.resolve(__dirname, '../dll/prod/vendor-manifest.json'),
    }),
    new webpack.DefinePlugin({
      BLITZ_SPRITE_MODIFIED_TIMESTAMP: JSON.stringify(
        getBlitzSpriteModifiedTimestamp() || ''
      ),
    })
  ];

  return {
    mode: "production",
    devtool: "cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            "thread-loader",
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
          use: [MiniCssExtractPlugin.loader, {
            loader: "css-loader",
            options: {
              url: false
            }
          }],
        },
      ],
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    plugins,
    output: {
      filename: "js/[name].[contenthash].js",
      chunkFilename: "js/[name].[contenthash].js",
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

module.exports = merge(commonConfig, prodConfig());