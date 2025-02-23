const path = require("path");
const fs = require("fs");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
require("dotenv").config();

//read contents of app/js/pages, each file is a page
const pages = fs.readdirSync(path.resolve(__dirname, "app", "js", "pages"));
const entryNames = pages.filter((page) => page.endsWith(".ts"));
const entries = {};
entryNames.forEach((entry) => {
  const name = entry.split(".")[0];
  entries[name] = path.resolve(__dirname, "app", "js", "pages", entry);
});

//set the environment
const env = process.env.NODE_ENV || "production";

module.exports = {
  entry: entries,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsclient.json"),
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  resolve: {
    extensions: [".ts"],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "client", "js"),
  },
  mode: env,
  devtool: env === "development" ? "eval" : false,
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/
  }
};
