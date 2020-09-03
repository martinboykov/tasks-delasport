const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const autoprefixer = require('autoprefixer');
const glob = require('glob');
const IS_DEV = process.env.NODE_ENV === 'development';

const config = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval' : 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'docs'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    index: 'index.html',
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    // },
    minimizer: [],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: IS_DEV,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions'],
              },
              sourceMap: IS_DEV,
              plugins: () => [autoprefixer],
            },
          },
          'sass-loader',
        ],
      },
      {
        // only fonts
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'public/fonts',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'public/images',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(), // remove all files inside webpack's output.path directory
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', 'public', 'images'),
        to: path.resolve(__dirname, 'docs', 'public', 'images'),
        toType: 'dir',
      },
      {
        from: path.resolve(__dirname, 'src', 'public', 'selection.json'),
        to: path.resolve(__dirname, 'docs', 'public'),
        toType: 'dir',
      }
    ]),
    new MiniCssExtractPlugin({
      filename: IS_DEV ? 'css/[name].css' : 'css/[name].css',
    }),
    new CssUrlRelativePlugin(),
    new PreloadWebpackPlugin({
      include: 'initial', // preloads .css and .js
    }),
  ],
};

if (!IS_DEV) {
  const TerserPlugin = require('terser-webpack-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

  config.optimization.minimizer.push(
    new TerserPlugin(),
    new OptimizeCSSAssetsPlugin({})
  );
}
const file = './src/views/index.handlebars';
config.plugins.push(
  new HtmlWebpackPlugin({
    inject: true,
    filename: path.basename(file).split('.')[0] + '.html',
    template: file,
    minify: !IS_DEV,
  })
);

module.exports = config;
