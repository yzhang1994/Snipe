require('dotenv').config();
require('babel-polyfill');
require('babel-core/register');

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

console.log('*** Building bundle from Webpack.DEV ***');

module.exports = {
  mode: 'none',
  entry: {
    bundle: ['babel-polyfill', './client/index.js'],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: [path.join(__dirname, 'client')],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'stage-2', 'env'] },
        }],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ttf|otf|svg|eot|woff|ico)$/,
        exclude: /(node_modules)/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]' } }],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ETH_NETWORK: JSON.stringify(process.env.ETH_NETWORK),
      },
    }),
    // new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     ie8: true,
    //     ecma: 7,
    //     mangle: false,
    //     output: { comments: false, beautify: false },
    //     warnings: false,
    //   },
    //   sourceMap: false,
    // }),
    // new CompressionPlugin({
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.js$|\.html$/,
    //   threshold: 1024,
    //   minRatio: 0.99,
    //   deleteOriginalAssets: false,
    // }),
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(['dist/*.*'], {
      root: path.join(__dirname, 'public'),
      verbose: true,
      dry: false,
    }),
  ],
  node: {
    fs: 'empty',
  },
};
