// the file is a modified copy from katex.js project, https://github.com/KaTeX/KaTeX

module.exports = (api) => {
  const isCJS = api.env("cjs");

  const presets = [
    ["@babel/preset-env", {
      loose: true,
    }],
  ];

  const plugins = [
    "@babel/transform-runtime",
    isCJS && "@babel/transform-modules-commonjs",
    isCJS && "add-module-exports",
    ["@babel/plugin-transform-spread", {
      loose: true,
    },],
    "@babel/transform-exponentiation-operator",
    // "preval",
  ];

  if (!isCJS) presets[0][1].modules = false;
  
  return {
    presets,
    plugins: plugins.filter(Boolean),
  };
};
