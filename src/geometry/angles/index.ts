/**
 * The idea of SCALE and some other methods are inspired by
 * the npm package https://www.npmjs.com/package/angles licensed under MIT OR GPL-2.0
 */

import * as extend from './angles-extend';
import { anglesJs } from './angles-external'; // https://www.npmjs.com/package/angles

//-------------------------//
//         types           //
//-------------------------//

export interface IAnglesPrivates {
  __dmsRegex: RegExp,
  __dmsSymbols: DMSSymbols;
  __SCALE: number;
  __HALF_SCALE: number;
  __RAD_TO_SCALE: number;
  __DEG_TO_SCALE: number;
  __GON_TO_SCALE: number;
}

export interface IAnglesPublics {
  SCALE: number;
  EPSILON: number;
  DMSSymbols: DMSSymbols;
  degMinSecSymbols: DMSSymbols;
}

export type Angles =
  (typeof anglesJs) & (typeof extend) &
  IAnglesPrivates & IAnglesPublics

export type DMSSymbols = { deg:string, min: string, sec: string };
  
//-------------------------//
//       actual logic      //
//-------------------------//

const angles: Partial<Angles> = {
  ...anglesJs,
  ...extend,
};

Object.defineProperty(angles, 'SCALE', {
  get() {
    return this.__SCALE;
  },
  set(v: number) {
    const h = v / 2;
    this.__SCALE = v;
    this.__HALF_SCALE = h;
    this.__RAD_TO_SCALE = h / Math.PI;
    this.__DEG_TO_SCALE = h / 180;
    this.__GON_TO_SCALE = h / 200;
  },
});

const dmsSymbolsDesribtor: PropertyDescriptor & ThisType<Angles> = {
  get() {
    return this.__dmsSymbols;
  },
  set(v: DMSSymbols) {
    this.__dmsSymbols = v;

    function repRegSpecials(str: string) {
      const specialSymbols = /\\|\^|\$|\[|\]|\{|\}|\(|\)|\.|\+|\*|\/|\|/g;
      return str.replace(specialSymbols, '\\\\$0');
    }

    const numRegex = '((?:-?\\d+(?:\\s*\\.\\s*)?\\d*)|(?:-?\\d*(?:\\s*\\.\\s*)?\\d+))';
    const degRegex = `(?:${numRegex}\\s*${repRegSpecials(this.__dmsSymbols.deg)})`;
    const minRegex = `(?:${numRegex}\\s*${repRegSpecials(this.__dmsSymbols.min)})`;
    const secRegex = `(?:${numRegex}\\s*${repRegSpecials(this.__dmsSymbols.sec)})`;
    this.__dmsRegex = new RegExp(`^\\s*${degRegex}?\\s*${minRegex}?\\s*${secRegex}?\\s*$`);
  },
};

Object.defineProperty(angles, 'degMinSecSymbols', dmsSymbolsDesribtor);
Object.defineProperty(angles, 'DMSSymbols', dmsSymbolsDesribtor);

angles.SCALE = 360;
angles.EPSILON = 1e-10;
angles.DMSSymbols = { deg: '°', min: '"', sec: "'" };

export default angles as Omit<Angles, keyof IAnglesPrivates>;
