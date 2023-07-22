module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'babel-plugin-module-resolver',
      {
        cwd: 'babelrc',
        extensions: ['.js', '.ios.js', '.android.js'],
        alias: {
          '@api': './app/api',
          '@axios': './app/axios',
          '@assets': './assets',
          '@config': './app/config',
          '@components': './app/components',
          '@navigation': './app/navigation',
          '@redux': './app/redux',
          '@utils': './app/utils',
          '@hooks': './app/hooks',
          '@lib': './app/lib',
          '@screens': './app/screens',
        },
      },
    ],
  ],
};
