// the file is a modified copy from katex.js project, https://github.com/KaTeX/KaTeX

module.exports = (api) => {
  const isESM = api.env("esm"),
    isCJS = api.env("cjs"),
    // as rollup input file is from the already handled es modules
    // from ./lib/esm, there is no need to handle again with babel
    isBundle = api.env(["bundle", "rollup"]);
  const presets = [
    [
      "@babel/preset-env",
      {
        loose: true,
      },
    ],
  ];

  const plugins = [
    !isBundle && "@babel/transform-runtime",
    isCJS && "@babel/transform-modules-commonjs",
    isCJS && "add-module-exports",
    [
      "@babel/plugin-transform-spread",
      {
        loose: true,
      },
    ],
    "@babel/transform-exponentiation-operator",
    // "preval",
  ];

  if (isESM) presets[0][1].modules = false;
  
  return {
    presets,
    plugins: plugins.filter(Boolean),
  };
};
