const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VuePlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { resolve } = require('./util')
const config = require('./config')

process.env.NODE_ENV = 'development'

module.exports = {
  entry: {
    app: resolve('src/app')
  },
  output: {
    filename: '[name]_[hash:6].js',
    path: resolve('dist'),
    publicPath: config.publicPath
  },
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: ['.js', '.vue', '.styl']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [resolve('node_modules')]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: [
          { loader: 'vue-style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'stylus-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.css?$/,
        use: [
          { loader: 'vue-style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.(jpg(e)?|png|gif|svg|woff|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      favicon: resolve('src/favicon.ico')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VuePlugin(),
    new CopyPlugin([
      {
        from: resolve('static'),
        to: resolve('dist/static'),
        toType: 'dir'
      }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    useLocalIp: true,
    clientLogLevel: 'warn',
    inline: true,
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true,
    // quiet: true
  },
  stats: 'errors-warnings',
  devtool: config.tool
}
