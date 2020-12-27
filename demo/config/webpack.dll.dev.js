const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: "dll_[name].js",
    path: path.resolve(__dirname, "../dll/dev"),
    library: "[name]_[hash]",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, '../dll/dev/**.*')]
    }),
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      context: __dirname,
      path: path.resolve(__dirname, "../dll/dev/[name]-manifest.json"),
    }),
  ],
};
