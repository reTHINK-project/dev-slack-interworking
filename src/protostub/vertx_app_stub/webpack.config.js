const path = require('path')

module.exports = {
  entry: './src/sharing-cities-dsm.ps.js',
  output: {
    filename: 'sharing-cities-dsm.ps.js',
    path: path.resolve(__dirname, '../../../dist/.well-known/protocolstub'),
    libraryTarget: 'system'
  }
}