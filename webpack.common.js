const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, "src/JS/index.js"),
    CitySearch: path.resolve(__dirname, "src/JS/API/CitySearch.js"),
    defaultCity: path.resolve(__dirname, "src/JS/API/defaultCity.js"),
    geolocation: path.resolve(__dirname, "src/JS/API/geolocation.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    clean: true,
    // assetModuleFilename: "images/[hash][ext][query]"
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "UrbanLeaf",
      filename: "index.html",
      template: "src/index.html",
    }),
    new Dotenv(),
  ],
};
