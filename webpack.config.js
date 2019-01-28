require('dotenv').config();

const path = require('path');
const ALIASES = require('./ALIASES');

// PLUGINS
/*
Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running,
without a full reload. This can significantly speed up development.
Named Modules plugin will cause the relative path of the module to be displayed when HMR is enabled.
Define plugin registers variables in the global namespace after build.
*/
const { HotModuleReplacementPlugin, NamedModulesPlugin, DefinePlugin } = require('webpack');


/*
UglifyJS plugin is used to minify your JavaScript outside of a dev environment.
https://www.npmjs.com/package/uglifyjs-webpack-plugin
*/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/*
This plugin extracts CSS into separate files.It creates a CSS file per JS file which contains CSS.
It supports On-Demand-Loading of CSS and SourceMaps.
https://github.com/webpack-contrib/mini-css-extract-plugin
*/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
For production, cleans your build folder before every build
https://github.com/johnagan/clean-webpack-plugin
*/
const CleanWebpackPlugin = require('clean-webpack-plugin');

const HtmlPlugin = require('html-webpack-plugin');

const ENV = process.env.ENV;


const getEntry = () => `${__dirname}/src/main.js`;


const getOutput = () => {
  return {
    path: `${__dirname}/build`,
    filename: '[name].[hash].js',
  };
};


const getPlugins = () => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: !!(ENV === 'development') ? '[name].css' : '[name].[hash].css',
      chunkFilename: !!(ENV === 'development') ? '[id].css' : '[id].[hash].css',
    }),
    new DefinePlugin({
      __DEBUG__: JSON.stringify(process.env.ENV != 'production'),
      __API_URL__: JSON.stringify(process.env.API_URL), 
    }),
    new HtmlPlugin({ template: `${__dirname}/src/public/index.html` }),
  ];

  if (ENV == 'development') {
    plugins.push(new HotModuleReplacementPlugin());
    plugins.push(new NamedModulesPlugin());
  } else {
    plugins.push(new CleanWebpackPlugin(['build']));
  }

  return plugins;
};


const getOptimization = () => {
  let optimization = {};
  optimization.splitChunks = {
    // Chunks can be a function that allows for control over which code to split
    chunks: 'all', 
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'all'
      },
      // This default chunk will catch all our other js as long as it looks like 
      default: {
        // minChunks : Minimum number of chunks that must share a module before splitting.
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  };

  if (ENV !== 'development') {
    optimization.minimizer = [new UglifyJsPlugin()];
  }

  return optimization;
};


const getDevTool = () => {
  if (ENV === 'development') {
    return 'cheap-module-eval-source-map';
  }
  return false;
};


const getDevServer = () => {
  if (ENV === 'development') return {
    contentBase: './build',
    open: true,
    hot: true,
    historyApiFallback: true,
  };
  return {};
};


const getModule = () => {
  return {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          (ENV === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  };
};

const getMode = () => {
  if (ENV === 'development') return ENV;
  return 'production';
};


const getResolve = () => {
  /**
   * Gets aliases for imports
   * @param {Array} ALIASES from './ALIASES
   * @returns {Object}
   */
  const createAliases = (ALIASES) => {
    let alias = {};
    ALIASES.forEach((item) => {
      const key = item[0];
      const value = path.resolve(__dirname, item[1]);
      alias[key] = value;
    });
    return alias;
  };

  return {
    extensions: ['.js', '.jsx'],
    alias: createAliases(ALIASES),
  };
};



module.exports = {
  context: __dirname,
  entry: getEntry(),
  output: getOutput(),
  plugins: getPlugins(),
  optimization: getOptimization(),
  devtool: getDevTool(),
  devServer: getDevServer(),
  module: getModule(),
  mode: getMode(),
  resolve: getResolve(),
};
