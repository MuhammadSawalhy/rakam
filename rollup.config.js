import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
const env = process.env.NODE_ENV;
let dev = !env || env.toLowerCase() !== "production";

export default {
   input: './src/index.js',
   output: {
      file: './lib/index.js',
      format: 'umd',
      name: 'rakam',
      sourcemap: dev,
      plugins: [terser()],
      strict: true
   },
   plugins: [babel()],
};