module.exports = {
    root: true,
    extends: ["expo", "plugin:@typescript-eslint/recommended"],
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  };
  