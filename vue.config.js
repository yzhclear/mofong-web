/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const isStaging = !!process.env.VUE_APP_IS_STAGING;
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyzeMode = !!process.env.ANALYZE_MODE;

module.exports = {
  publicPath: isProduction && !isStaging ? 'https://oss.imooc-lego.com/editor' : './',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3E7FFF',
            'border-radius-base': '20px',
            'border-radius-sm': '10px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    );
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      );
    }

    const iconPath = path.resolve(__dirname, './src/icons.ts');
    config.resolve.alias['@ant-design/icons-vue/es$'] = iconPath;
    config.resolve.alias['vue'] = path.resolve(`./node_modules/vue`);

    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: 'all',
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    };
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '魔方鱼';
      return args;
    });
  },
};
