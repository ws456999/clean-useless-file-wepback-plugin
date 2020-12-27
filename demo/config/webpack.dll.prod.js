const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: "dll_[name].js",
    path: path.resolve(__dirname, "../dll/prod"),
    library: "[name]_[hash]",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, '../dll/prod/**.*')]
    }),
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      context: __dirname,
      path: path.resolve(__dirname, "../dll/prod/[name]-manifest.json"),
    }),
  ],
};
