// ContextReplacementPlugin "scryptsy" -> "scryptsy/lib"
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ContextReplacementPlugin(/scryptsy/, /scryptsy\/lib\/index.js/)
  ]
};
