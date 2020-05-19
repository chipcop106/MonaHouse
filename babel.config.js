module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      [
        "babel-plugin-root-import", 
        {
          "rootPathPrefix": "~",
          "rootPathSuffix": "src"   
        }
      ]
    ],
    presets: ['babel-preset-expo'],
    "env": {
      "production": {
        "plugins": [
          [
            "babel-plugin-root-import",
            {
              "rootPathPrefix": "~",
              "rootPathSuffix": "src"
            }
          ]
        ]
      }
    }
  };
};
