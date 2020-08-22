import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
const env = process.env.NODE_ENV;

export default {
   input: './src/MathPackage.js',
   output: {
      file: './lib/MathPackage.js',
      format: 'umd',
      name: 'MathPackage',
      sourcemap: env.toLowerCase() !== "production",
      plugins: [terser()],
      strict: true
   },
   plugins: [babel()],
};