/**
 * take the babelified files in ./lib/esm/ and create a bundled file and a minified one with source maps.
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
  
  // read the version number from package.json
  function getVersion () {
    return require('./package.json').version;
  }
  
  // read the desription number from package.json
  function wrapText (t, max) {
    if(t.indexOf('\n') > -1){
      return t.split('\n').map(a=>{
        if(a) return '    ' + wrapText(a, max);
        return a;
      }).join('\n');
    } else {
      if (t.length <= max) return t;
      let c = 0; // counter
      return t.split(' ').map(a=>{
        if(a) {
          c += a.length;
          if(c > max) { c = 0; return a + "\n"; }
        }
        return a;
      }).join(' ');
    }
  }

  // read the description number from package.json
  function getDescription () {
    return wrapText(require('./package.json').description, 80);
  }

  const today = new Date().toISOString().substr(0, 10); // today, formatted as yyyy-mm-dd
  const version = getVersion();
  const description = getDescription();

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
    // babel({ babelHelpers: 'bundled' }),
  ],
};

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
