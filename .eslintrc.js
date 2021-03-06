module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "react",
        "react-native", // add eslint-plugin-react-native as a plugin for ESLint
    ],
    "parser": "babel-eslint",
    "rules": {
        "no-console": "off",
        "strict": 0,
        "no-debugger": 2,
        "quote-props": ["error", "consistent"],
        "react/prop-types": "off",
        "quotes": ["error", "double", { "avoidEscape": true }],
        "import/no-named-as-default": 0,
        "react-native/no-unused-styles": 2, // disallow unused styles
        "react-native/no-inline-styles": "off", // disallow styles declared within the component itself
        "react-native/no-color-literals": "off", // enforces variable names to be used for storing colors
        "global-require": "off", // React Native images uses the require syntax so we're turning it off so that we don't get any errors,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }], // disable the rule for variables, but enable it for functions and classes
    },
};
