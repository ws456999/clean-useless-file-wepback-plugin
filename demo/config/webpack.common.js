const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UselessFile = require('../../index');
const CopyPlugin = require("copy-webpack-plugin");
const ASSET_PATH = `https://static.gllue.com/plugin/bootstrapper/123/`;

const commonConfig = () => {
  const plugins = [
    new UselessFile({
      root: './src', // 项目目录
      out: './fileList.json', // 输出文件列表
      clean: false, // 删除文件,
      exclude: [
        /blitz/g,
        // 'blitz-container'
      ] // 排除文件列表, 格式为文件路径数组
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: path.resolve(__dirname, "../build/index.html"),
    }),
    new CleanWebpackPlugin(),
  ];

  return {
    entry: {
      main: "./src/index.tsx",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          // include: path.resolve(__dirname, "../src"),
          include: [path.resolve(__dirname, "../src")],
          use: [
            {
              loader: "thread-loader",
              options: {
                workers: 3,
                workerParallelJobs: 50,
              },
            },
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: {
                        chrome: "67"
                      },
                      useBuiltIns: "usage",
                      corejs: "3.7"
                    }
                  ],
                  "@babel/preset-react",
                  ["@babel/preset-typescript", {
                    allowDeclareFields: true,
                    onlyRemoveTypeImports: true
                  }]
                ],
                plugins: [
                  "@babel/plugin-syntax-dynamic-import",
                  "@babel/plugin-proposal-class-properties",
                  [
                    "babel-plugin-named-asset-import",
                    {
                      loaderMap: {
                        "svg": {
                          "ReactComponent":
                            "@svgr/webpack?-svgo,+titleProp,+ref![path]"
                        }
                      }
                    }
                  ],
                ]
              }
            },
          ],
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: "url-loader",
            options: {
              // name: "[name]_[hash].[ext]",
              // outputPath: "images/",
              limit: 10240,
            },
          },
        },
        {
          test: /\.(svg|woff|woff2|ttf)$/,
          // exclude: /roboto-font/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: ASSET_PATH,
          },
        },
      ],
    },
    plugins,
    optimization: {
      runtimeChunk: {
        name: "runtime",
      },
      usedExports: true,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: "vendors",
          },
        },
      },
    },
    performance: false,
    output: {
      path: path.resolve(__dirname, "../build"),
    },
  };
};

module.exports = commonConfig();
