import MathParserNode from '@scicave/math-parser/lib/Node';
import Unexpected from '../../../errors/Unexpected';
import type { Math2JsHandlingOptions } from '../../types';
import { getScopedId } from '../utils';

/*
Node.types = {
  NUMBER: "number",
  ID: "id",
  FUNCTION: "function",
  AUTO_MULT: "automult",
  OPERATOR: "operator",
  POSTFIX_OPERATOR: "postfix operator",
  MEMBER_EXPRESSION: "member expression",
  PARENTHESES: "parentheses",
  ABS: "abs", // | value |

  // can't be handled, needs a handler
  INTERVAL: "interval",
  MATRIX: "matrix",
  TUPLE: "tuple",
  SET: "set",
  ELLIPSIS: "ellipsis",
  BLANK: "blank",
};
*/

/**
 * compile AST into js code
 * @param ast instance of mathParer.Node
 * @param options math2js handling options
 * @returns part of the js code expression as `string`
 */
export default function generateJs(ast: MathParserNode, options: Math2JsHandlingOptions) {
  let { params, scope, handlers } = options;

  for (let h of handlers) {
    if (h.test(ast)) {
      return h.handle(ast, options);
    }
  }

  if (ast.checkType('number')) return ast.value;

  if (ast.checkType('id')) return getScopedId(ast.name, options);

  if (ast.checkType('member expression')) {
    let obj: string, mem: string;
    // parserTree.args[0] may be another member expression
    
    obj = generateJs(ast.args[0], options);
    
    if (ast.args[1].checkType('id')) {
      mem = ast.name;
    } else if (ast.args[1].checkType('function')) {
      // this is the samp algorithm in generateJs of type function here below.
      let args = generateJs(ast.args[1].args[0], options);
      let name = ast.args[1].name;
      mem = `${name}(${args})`;
    } else {
      throw new Unexpected("unexpected member expression in the AST");
    }

    return obj + '.' + mem;
  }

  if (ast.checkType('function')) {
    let args = ast.args.map((a: string) => generateJs(a, options)).join(", ");
    let name = getScopedId(ast.name, options);
    return `${name}(${args})`;
  }

  if (ast.checkType('parentheses')) {
    return `(${generateJs(ast.args[0], options)})`;
  }

  if (ast.check({ type: 'operator', operatorType: 'postfix' })) {
    let arg = generateJs(ast.args[0], options);
    return arg + ast.name;
  }

  if (ast.check({ type: 'operator', operatorType: 'infix' })) {
    let left = generateJs(ast.args[0], options);
    let right = generateJs(ast.args[1], options);
    let op = ast.name;
    if (op === "^") op = '**';
    return left + ' ' + op + ' ' + right;
  }

  if (ast.checkType('automult')) {
    let left = generateJs(ast.args[0], options);
    let right = generateJs(ast.args[1], options);
    let op = '*';
    return left + ' ' + op + ' ' + right;
  }

  if (ast.checkType('abs')) {
    return `Math.abs(${generateJs(ast.args[0], options)})`;
  }

  throw new Error("can't handle the math parser tree, hint: add handlers through options");
}
