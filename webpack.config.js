/**
 * Webpack config file.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    layout: './client/js/layout.js',
    notes: './client/js/notes.js',
    analytics: './client/js/analytics.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, './client/scss')]
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|svg|eot|jpg|png|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  devtool: 'cheap-eval-source-map'
}