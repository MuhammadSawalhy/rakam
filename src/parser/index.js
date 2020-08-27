
import mathParser from "@scicave/math-parser";
import math2js from './math2js.js';
import math2latex from './math2latex.js';

import texParser from "@scicave/math-latex-parser";
import latex2js from './latex2math.js';
import latex2math from './latex2math.js';

function randomName() {
  return (Date.now() + randomName.counter++).toString(32).replace(/\d/, "");
}

randomName.counter = 0;

class Parser {
  constructor() {

    this.prototype.mathParser = mathParser;
    this.prototype.math2js = math2js;
    this.prototype.math2latex = math2latex;

    this.prototype.texParser = texParser;
    this.prototype.latex2js = latex2js;
    this.prototype.latex2math = latex2math;

  }
}

export default Parser;
