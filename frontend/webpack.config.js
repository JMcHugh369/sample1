module.exports = {
  resolve: {
    fallback: {
      process: require.resolve('process/browser'), // Polyfill for process
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react', { runtime: 'automatic' }] // Enable modern JSX transform
            ],
          },
        },
      },
    ],
  },
  watchOptions: {
    ignored: /C:\\DumpStack.log.tmp/, // Ignore the locked file
  },
};