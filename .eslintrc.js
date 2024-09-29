module.exports = {
  root: true,
  extends: ["base"],
  settings: {
    next: {
      rootDir: ["ui/"],
    },
  },
  parserOptions: {
    sourceType: "module",
  },
  ignorePatterns: ["backend/", "contracts"],
};
