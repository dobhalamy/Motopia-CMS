module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "react/prop-types": [
      "error",
      {
        ignore: [
          "router",
          "params",
          "location",
          "classes",
          "theme",
          "handleBlur",
          "onBlur",
          "setFieldValue",
          "errors",
          "touched",
          "width",
          "inputRef"
        ]
      }
    ]
  }
};
