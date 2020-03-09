const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/components/index.tsx",
  output: {
    path: path.resolve(__dirname, "build")
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.(tsx|ts)?$/,
        loader: [
          "awesome-typescript-loader?configFileName=./tsconfig.release.json"
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: [
          { loader: "css-modules-typescript-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(svg|png|eot|woff|woff2|ttf)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: "./src/components/commonV2/dao/Schemes/styles.css",
        to: "../dist/commonV2/dao/Schemes/styles.css"
      },
      {
        from: "./src/components/commonV2/dao/Migrator/styles.css",
        to: "../dist/commonV2/dao/Migrator/styles.css"
      },
      {
        from: "./src/components/commonV2/dao/Members/styles.css",
        to: "../dist/commonV2/dao/Members/styles.css"
      },
      {
        from: "./src/components/commonV2/FormField/styles.css",
        to: "../dist/commonV2/FormField/styles.css"
      },
      {
        from: "./src/components/commonV2/Stepper/styles.css",
        to: "../dist/commonV2/Stepper/styles.css"
      },
      {
        from: "./src/components/DAOcreatorV2/styles.css",
        to: "../dist/DAOcreatorV2/styles.css"
      }
    ])
  ]
};
