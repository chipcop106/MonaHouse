module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ],
    presets: ['babel-preset-expo'],
  };
};
