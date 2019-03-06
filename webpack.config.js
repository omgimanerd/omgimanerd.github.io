/**
 * Webpack config file.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const path = require('path')

module.exports = {
  entry: {
    analytics: './client/js/analytics.js',
    error: './client/js/error.js',
    index: './client/js/index.js',
    notes: './client/js/notes.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
  devtool: 'cheap-eval-source-map',
  mode: 'development'
}
