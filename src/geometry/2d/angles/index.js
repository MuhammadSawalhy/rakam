
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

Object.defineProperty(angles, 'SCALE', {
  get(){
    return this.__SCALE;
  },
  set(v){
    var h = v / 2;
    this.__SCALE        = v; this.__HALF_SCALE   = h;
    this.__RAD_TO_SCALE = h / Math.PI;
    this.__DEG_TO_SCALE = h / 180;
    this.__GON_TO_SCALE = h / 200;
  }
});

const dmsSymbolsDesribtor  = {
  get(){
    return this.__dmsSymbols;
  },
  set(v){
    this.__dmsSymbols = v;

    function repRegSpecials(str) {
      var specialSymbols = /\\|\^|\$|\[|\]|\{|\}|\(|\)|\.|\+|\*|\/|\|/g;
      return str.replace(specialSymbols, '\\\\$0');
    }

    this.__dmsRegex = new RegExp(`^\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${repRegSpecials(this.__dmsSymbols.deg)})?\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${repRegSpecials(this.__dmsSymbols.min)})?\\s*(?:((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))\\s*${repRegSpecials(this.__dmsSymbols.sec)})?\\s*$`);
  }
}

Object.defineProperty(angles, 'degMinSecSymbols', dmsSymbolsDesribtor);
Object.defineProperty(angles, 'DMSSymbols', dmsSymbolsDesribtor);

angles.SCALE = 360;
angles.EPSILON = 1e-10;
angles.DMSSymbols = {deg: '°', min: '"', sec: "'"};

export default angles;