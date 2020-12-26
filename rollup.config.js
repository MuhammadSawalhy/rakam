/**
 * take the babelified files in ./module/
 * and create a bundled file and a minified one with source maps.
 * no need to use babel here
 */

import { terser } from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
// import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const fs = require('fs')
const HEADER = './src/header.js';
const SRC = "./module/index.js";
const DEST = "./main/"; // overwrite the existing index.js

// process.env.NODE_ENV = 'rollup'; // for ./babel.config.js

// generate banner with today's date and correct version
function createBanner () {
  
  let { version, description } = require('./package.json');

  const today = new Date().toISOString().substr(0, 10); // today, formatted as yyyy-mm-dd

  return String(fs.readFileSync(HEADER))
    .replace('@@description', description)
    .replace('@@date', today)
    .replace('@@version', version);

}

const config = {
  input: SRC,
  output: {
    file: DEST + "index.js",
    format: "umd",
    name: "rakam",
    sourcemap: true,
    strict: true,
    banner: createBanner(),
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
};

// minify using specialized module for minification
const minConfig = {
  ...config,
  input: SRC,
  output: {
    ...config.output,
    file: DEST + "index.min.js",
    plugins: [ terser() ],
  }
};

export default [ config, minConfig ];
