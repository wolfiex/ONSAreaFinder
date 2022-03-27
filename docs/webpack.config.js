const path = require("path");

const config = {
  entry: "./index.js",
//    resolve: {
//         alais: {
//             leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css"
//         }
//     },
  mode: "development",
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.js$|jsx/,
        loader: "babel-loader"
      },
    {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
    },
    ]
  },
  output: {
    path: path.resolve(__dirname, "")
  },
  plugins: []
};

module.exports = config;