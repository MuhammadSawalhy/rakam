import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const env = process.env.NODE_ENV;
let dev = !env || env.toLowerCase() !== "production";

export default {
  input: "./src/index.js",
  output: {
    file: "./lib/index.js",
    format: "umd",
    name: "rakam",
    sourcemap: dev,
    plugins: [!dev && terser()].filter(Boolean),
    strict: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' })
  ],
};
