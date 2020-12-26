
// babel-jest is used by default when testing with jest

module.exports = (api) => {
  // set inside gulp tasks
  const isCJS = api.env("cjs");
  const isESM = api.env("esm");

  const presets = [
    ["@babel/preset-env", {
      loose: true,
    }],
  ];

  const plugins = [
    // when building main, module directories only
    (isCJS || isESM) && "@babel/transform-runtime",
    isCJS && "@babel/transform-modules-commonjs",
    isESM && "add-module-exports",
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
