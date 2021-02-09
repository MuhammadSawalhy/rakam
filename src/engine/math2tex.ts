import MathParserNode from '@scicave/math-parser/lib/Node';
import mathParser from '@scicave/math-parser';
import {Math2LatexOptions} from './types';

// you can find them in mathParser.Node.types.operators
const texOperators = {
  ">=": "\\geq",
  "<=": "\\leq",
  "<": "\\lt",
  ">": "\\gt",
  "!=": "\\neq"
};

/**
 * convert ascii math into tex
 */
export default function math2tex(
  math: string | MathParserNode,
  options: Math2LatexOptions={},
  parserOptions={}
): string {
  
  // default options
  options = Object.assign({
    autoMult: true,
    cdot: true,
    matrixType: "bmatrix",
  }, options)

  // keepParen is obligated to be true
  parserOptions = Object.assign(parserOptions, {
    keepParen: true,
  });

  // parse it if not already parsed
  math = typeof math === 'object' ? math : mathParser.parse(math, parserOptions);

  return generateTex(math, options);

}

export function generateTex(math: MathParserNode, options: Math2LatexOptions): string {
  
  if (true) {

  }

  return '';
}

