import Angles from './index/Angles.js';
import Lines from './index/Lines.js';
import Core from './index/Core.js';
import Parser from './Parser.js';

export default class MathPackage {

   constructor() {
      this.MagicalMathParser = new MagicalParser.CustomParsers.Math();
      this.Parser = new Parser(this.MagicalMathParser);
   }

}