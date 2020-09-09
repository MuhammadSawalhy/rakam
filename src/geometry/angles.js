
/**
 * The idea of SCALE and some other methods are inspired by
 * the npm package https://www.npmjs.com/package/angles licensed under MIT OR GPL-2.0
 */

import * as extend from './angles-extend.js';
import anglesJs from './angles-external.js'; // https://www.npmjs.com/package/angles

const angles = {

  ...anglesJs,
  ...extend,

};

Object.defineProperty(angles, 'degMinSecSymbols', {
  get(){
    return this.__dmsSymbols;
  },
  set(v){
    this.__dmsSymbols = v;
    this.__dmsRegex = new RegExp(`^\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${this.__dmsSymbols.deg})?\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${this.__dmsSymbols.min})?\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${this.__dmsSymbols.sec})?\\s*$`);
  }
});

angles.degMinSecSymbols = {deg: '°', min: '"', sec: "'"};

export default angles;