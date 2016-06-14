var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'scripts/example.js')
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  resolve: {
  	extensions: ['', '.js', '.jsx','.css']
  },
  module: {
    loaders: [
        { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.css$/, loader: "style!css" }
    ]
  }
};