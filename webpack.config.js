const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'texcel.min.js',
    path: path.resolve(__dirname, 'dist')
  },
	mode: 'production',
}
