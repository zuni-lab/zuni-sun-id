/** @type {import('next').NextConfig} */
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: (config) => {
    // added due to issues finding these packages when running. Github issue/comment:
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // config.plugins.push(new NodePolyfillPlugin());

    // if (!isServer) {
    //   config.resolve.fallback = {
    //     ...config.resolve.fallback,
    //     crypto: require.resolve('crypto-browserify'),
    //     // add other polyfills if necessary
    //   };
    // }

    return config;
  },
};

module.exports = nextConfig;
