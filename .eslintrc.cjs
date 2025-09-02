module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    ignorePatterns: ["dist", "build", ".next", "coverage", "node_modules"]
  }
  