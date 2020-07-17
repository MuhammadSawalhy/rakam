/**
 * Using Parser.js we can do incredible things ::: {<>}
 */

export default class Parser {

   constructor(mathParserLib) {
      this.mathParserLib = mathParserLib;
      this.maximaTOlatex = new tex2max({ disallowDecimalCommas: false, addTimesSign: false });
   }

   //#region  parserNode to ___

   parsedTOnode(snode) {
      let expr = snode;
      if (expr.type === 'number') {
         return new Constant(parseFloat(expr.value));
      } else if (expr.type === 'variable')
         return new Variable(expr.name);

      else if (expr.args.length == 2) {
         {

            if (expr.calls('&&', 2) && (expr.args[0]) && (expr.args[1]) ||
               expr.calls("and", 2) && (expr.args[0]) && (expr.args[1])) return new And(snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]));
            else if (expr.calls('||', 2) && (expr.args[0] = expr.args[0]) && (expr.args[1]) ||
               expr.calls("or", 2) && (expr.args[0] = expr.args[0]) && (expr.args[1])) {
               let a = snodeTOnode(expr.args[0]), b = snodeTOnode(expr.args[1]);
               if ((a.type === 'boolop' || b.type === 'bool') && (b.type === 'boolop' || b.type === 'bool')) return new Or(expr.args[0], expr.args[1]);
               else return new NullCoalesce(expr.args[0], expr.args[1]);
            }
            else if (expr.calls('>', 2) && (expr.args[0]) && (expr.args[1])) return new GreaterThan([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('<', 2) && (expr.args[0]) && (expr.args[1])) return new LowerThan([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('>=', 2) && (expr.args[0]) && (expr.args[1])) return new GreaterEquals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('<=', 2) && (expr.args[0]) && (expr.args[1])) return new LowerEquals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('=', 2) && (expr.args[0]) && (expr.args[1])) return new Equals([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('!=', 2) && (expr.args[0]) && (expr.args[1])) return new NotEqual([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('&', 2) && (expr.args[0]) && (expr.args[1])) return new Band([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('|', 2) && (expr.args[0]) && (expr.args[1])) return new Bor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls("xor", 2) && (expr.args[0]) && (expr.args[1])) return new Xor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls("xor", 2) && (expr.args[0]) && (expr.args[1])) return new Bxor([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);


            else if (expr.calls('+', 2) && (expr.args[0]) && (expr.args[1])) return new Add([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('*', 2) && (expr.args[0]) && (expr.args[1])) return new Multiply([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('-', 2) && (expr.args[0]) && (expr.args[1])) return new Subtract([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('/', 2) && (expr.args[0]) && (expr.args[1])) return new Divide([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('mod', 2) && (expr.args[0]) && (expr.args[1])) return new Mod([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('^', 2) && (expr.args[0]) && (expr.args[1])) return new Power([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('>>', 2) && (expr.args[0]) && (expr.args[1])) return new ShiftRight([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls('<<', 2) && (expr.args[0]) && (expr.args[1])) return new ShiftLeft([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

            else if (expr.calls("log", 2) && (expr.args[0]) && (expr.args[1])) return new Log([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

            else if (expr.calls("in", 2) && (expr.args[0]) && (expr.args[1]) && expr.args[1].calls('()', 2) && (lo = tmp_10.args[0]) && (hi = tmp_10.args[1]))
               return new In(snodeTOnode(expr.args[0]), snodeTOnode(lo), snodeTOnode(hi));

            else if (expr.calls("in", 2) && (expr.args[0]) && (expr.args[1]) && (expr.args[1].calls("[]", 2)) && (lo = tmp_10.args[0]) && (hi = tmp_10.args[1]))
               return new In(snodeTOnode(a, calculationSettings), snodeTOnode(lo), snodeTOnode(hi));

            else if (expr.calls("constrain", 2) && (expr.args[0]) && (expr.args[1]) && (expr.args[1].calls('()', 2) || expr.args[1].calls("[]", 2)) && (expr.args[1].args[0]) && (expr.args[1].args[1]))
               return new Constrain([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1].args[0]), snodeTOnode(expr.args[1].args[1])]);

            else if (expr.calls("P", 2) && (expr.args[0]) && (expr.args[1])) return new nPr([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);
            else if (expr.calls("C", 2) && (expr.args[0]) && (expr.args[1])) return new nCr([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])]);

         }
      }

      {
         if (expr.calls('-', 1, 'preop') && (expr.args[0])) return new Neg(snodeTOnode(expr.args[0]));
         else if (expr.calls('not', 1, 'preop') && (expr.args[0])) return new Not(snodeTOnode(expr.args[0]));
         else if (expr.calls('bnot', 1, 'preop') && (expr.args[0])) return new BNot(snodeTOnode(expr.args[0]));

         else if (expr.calls('?', 2, 'op') && (expr.args[0]) && (expr.args[1]))
            return new If([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), null]);
         else if (expr.calls("if", 2, 'func') && (expr.args[0]) && (expr.args[1]))
            return new If([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), null]);
         else if (expr.calls("if", 3, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]))
            return new If([snodeTOnode(a), snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2])]);

         else if (expr.calls("sqrt", 1, 'func') && (expr.args[0])) return new Sqrt([snodeTOnode(expr.args[0])]);
         else if (expr.calls("sin", 1, 'func') && (expr.args[0])) return new Sin([snodeTOnode(expr.args[0])]);
         else if (expr.calls("cos", 1, 'func') && (expr.args[0])) return new Cos([snodeTOnode(expr.args[0])]);
         else if (expr.calls("tan", 1, 'func') && (expr.args[0])) return new Tan([snodeTOnode(expr.args[0])]);
         else if (expr.calls("asin", 1, 'func') && (expr.args[0])) return new Asin([snodeTOnode(expr.args[0])]);
         else if (expr.calls("acos", 1, 'func') && (expr.args[0])) return new Acos([snodeTOnode(expr.args[0])]);
         else if (expr.calls("atan", 1, 'func') && (expr.args[0])) return new Atan([snodeTOnode(expr.args[0])]);
         else if (expr.calls("sec", 1, 'func') && (expr.args[0])) return new Sec([snodeTOnode(expr.args[0])]);
         else if (expr.calls("csc", 1, 'func') && (expr.args[0])) return new Csc([snodeTOnode(expr.args[0])]);
         else if (expr.calls("cot", 1, 'func') && (expr.args[0])) return new Cot([snodeTOnode(expr.args[0])]);
         else if (expr.calls("exp", 1, 'func') && (expr.args[0])) return new Exp([snodeTOnode(expr.args[0])]);
         else if (expr.calls("ln", 1, 'func') && (expr.args[0])) return new Ln([snodeTOnode(expr.args[0])]);
         else if (expr.calls("log", 1, 'func') && (expr.args[0])) return new Log([snodeTOnode(expr.args[0]), new Constant(10)]);
         else if (expr.calls("ceil", 1, 'func') && (expr.args[0])) return new Ceil([snodeTOnode(expr.args[0])]);
         else if (expr.calls("floor", 1, 'func') && (expr.args[0])) return new Floor([snodeTOnode(expr.args[0])]);
         else if (expr.calls("Round", 1, 'func') && (expr.args[0])) return new Round([snodeTOnode(expr.args[0])]);
         else if (expr.calls("sign", 1, 'func') && (expr.args[0])) return new Sign([snodeTOnode(expr.args[0])]);
         else if (expr.calls("abs", 1, 'func') && (expr.args[0])) return new Abs([snodeTOnode(expr.args[0])]);
         else if (expr.calls("fact", 1, 'func') && (expr.args[0])) return new Factorial([snodeTOnode(expr.args[0])]);
         else if (expr.calls("!", 'sufop') && (expr.args[0])) return new Factorial([snodeTOnode(expr.args[0])]);
         else if (expr.calls("random", 'func'))
            return _getRandom(expr);
         else if (expr.calls("min", 'func')) {
            let childres = new Array(expr.args.length);
            for (let i = 0; i < expr.args.length; i++) {
               if (expr.args[i] == null)
                  throw new Exception("Passed argument musn't be void.");
               childres[i] = snodeTOnode(expr.args[i]);
            }
            return new Min(new Set(childres, true));
         }
         else if (expr.calls("max", 'func')) {
            let childres = new Array(expr.args.length);
            for (let i = 0; i < expr.args.length; i++) {
               if (expr.args[i] == null)
                  throw new Exception("Passed argument musn't be void.");
               childres[i] = snodeTOnode(expr.args[i]);
            }
            return new Max(new Set(childres, true));
         }
         else if (expr.calls("constrain", 3, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2])) {
            return new Constrain([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2])]);
         }

         /// gcm, hcm, gcf, hcf, gcd, hcd
         else if (expr.calls("gcm") || expr.calls("hcm") || expr.calls("gcf") || expr.calls("hcf") || expr.calls("gcd") || expr.calls("hcd")) {
            let childres = new Array(expr.args.length);
            for (let i = 0; i < expr.args.length; i++) {
               if (expr.args[i] == null)
                  throw new Exception("Passed argument musn't be void.");
               childres[i] = snodeTOnode(expr.args[i]);
            }
            return new GCD(new Set(childres, true));
         }
         /// lcm, lcd
         else if (expr.calls("lcm") || expr.calls("lcd")) {
            let childres = new Array(expr.args.length);
            for (let i = 0; i < expr.args.length; i++) {
               if (expr.args[i] == null)
                  throw new Exception("Passed argument musn't be void.");
               childres[i] = snodeTOnode(expr.args[i]);
            }
            return new GCD(new Set(childres, true));
         }

         else if (expr.calls("sum", 4, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]) && (expr.args[3])) {
            if (expr.args[0].type === 'id') {
               //Here temp vars will be added
               return new Sum(expr.args[0].value, [snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]), new Constant(1), snodeTOnode(expr.args[3])]);
            }
         }
         else if (expr.calls("sum", 5, 'func') && (expr.args[0]) && (expr.args[1]) && (expr.args[2]) && (expr.args[3]) && (expr.args[4])) {
            if (expr.args[0].type === 'id') {
               //Here temp vars will be added
               return new Sum(expr.args[0].value, [snodeTOnode(expr.args[1]), snodeTOnode(expr.args[2]), snodeTOnode(expr.args[3]), snodeTOnode(expr.args[4])]);
            }
         }

         else if (expr.calls("derivate", 1) && (expr.args[0])) {
            return new Derivate(snodeTOnode(expr.args[0]));
         }

         // to get a list of numbers ::: [0,1,2]     [0,...,5]
         else if (expr.calls("{}")) {
            if (expr.toString().Contains("...")) {

            }
            else {
               let items = [];
               for (let arg of expr.args) {
                  let i = snodeTOnode(arg);
                  items.push(i);
               }
               let list = new Set(items, true);
               return list;
            }
         }

         else if (expr.calls(".")) {
            if (expr.dotType === 'id') {
               return new Variable(expr.extension);
            }
            else if (expr.dotType === 'func') {
               return new Func(expr.extension, expr.args[1].args);
            }
         }

         // to get functions
         else if (expr.type === 'func') {
            let args = [];
            for (let i = 0; i < expr.args.length; i++) {
               args.push(snodeTOnode(expr.args[i]));
            }
            return new Func(expr.name, args);
         }

      }

      throw new Error("Expression not understood: " + expr.toString());

   }

   _getRandom(expr) {
      let type = 'double';
      let TypeAssigned = false;
      if (expr.args.length > 0)
         if (expr.args[expr.args.length - 1].type === 'id') {
            if (expr.args[expr.args.length - 1].name === "int") {
               type = 'int';
               TypeAssigned = true;
            }
         }

      if (TypeAssigned) {
         expr.args.pop();
      }

      if (expr.args.length == 0) {
         return new Random([], type);
      }
      if (expr.args.length == 1) {
         return new Random([snodeTOnode(expr.args[0])], type);
      }
      if (expr.args.length == 2) {
         return new Random([snodeTOnode(expr.args[0]), snodeTOnode(expr.args[1])], type);
      }
      return null;
   }

   /**
    * 
    * @param {MagicalParser.Node} parsed 
    * @param {Array} params 
    * @param {String} math is the math object containing the functions and the variables that is not a parameter.
    * @param {Boolean} strict
    */
   parsedTOjsFunction(parsed, params = [], math = 'Math', strict = true) {
      let undef = { vars: [], funcs: [] };
      let func = new Function(...params, `${strict ? '"use strict";\n' : ''}return ${this.__generateJS(parsed, params, math, undef)};`);
      undef.vars = undef.vars.reduce((b, a) => {
         if (!b.find(e => e === a)) b.push(a);
         return b;
      }, []);
      undef.funcs = undef.funcs.reduce((b, a) => {
         if (!b.find(e => e === a)) b.push(a);
         return b;
      }, []);
      return { func, undef };
   }

   __generateJS(parsed, params = [], math = "Math", undef = null) {
      if (parsed.type === 'number') {
         return parsed.value;
      } else if (parsed.type === 'functionCalling') {
         switch (parsed.name) {
            case 'sum':
               if (!parsed.args[0].check({ type: 'separator', name: ',', length: 4 }) || !parsed.args[0].args[1].type === 'variable') throw new Error('sum function has not valid arguments: "' + parsed.match + '"');
               let sumParam = parsed.args[0].args[1].name;
               let newParams = [...params];
               newParams.push(sumParam);
               let sumExpr = this.__generateJS(parsed.args[0].args[0], newParams, math, undef);
               let start = this.__generateJS(parsed.args[0].args[2], params, math, undef);
               let end = this.__generateJS(parsed.args[0].args[3], params, math, undef);
               return `(()=>{
                  let _ = 0;
                  for(let ${sumParam} = ${start}; ${sumParam} <= ${end}; ${sumParam}++){
                     _ += ${sumExpr};
                  }
                  return _; 
               })()`;
            default:
               if (params.find(param => parsed.name === param)) {
                  return parsed.name + `(${this.__generateJS(parsed.args[0], params, math, undef)})`;
               }
               if (!window[math].hasOwnProperty(parsed.name)) undef.funcs.push(parsed.name);
               return math + `.${parsed.name}(${this.__generateJS(parsed.args[0], params, math, undef)})`;
         }
      } else if (parsed.type === 'variable') {
         if (params.find(param => parsed.name === param)) {
            return parsed.name;
         }
         if (!window[math].hasOwnProperty(parsed.name)) undef.vars.push(parsed.name);
         return math + '.' + parsed.name;
      } else if (parsed.type === 'block') {
         let opening, closing;
         switch (parsed.name) {
            case '()':
               opening = '(';
               closing = ')';
               break;
            case '[]':
               opening = '[';
               closing = ']';
               break;
            case '{}':
               opening = '{';
               closing = '}';
               break;
         }
         return opening + this.__generateJS(parsed.args[0], params, math, undef) + closing;
      } else if (parsed.type === 'operator') {
         switch (parsed.name) {
            case '.':
               return this.__generateJS(parsed.args[0], params, math, undef) + '.' + parsed.args[1].match;
            case '^':
               return this.__generateJS(parsed.args[0], params, math, undef) + ' ** ' + this.__generateJS(parsed.args[1], params, math, undef);
            case '=':
               return this.__generateJS(parsed.args[0], params, math, undef) + ' == ' + this.__generateJS(parsed.args[1], params, math, undef);
            default:
               return this.__generateJS(parsed.args[0], params, math, undef) + ' ' + parsed.name + ' ' + this.__generateJS(parsed.args[1], params, math, undef);
         }
      } else if (parsed.type === 'suffixOperator') {
         switch (parsed.name) {
            case '!':
               return 'Math.fact(' + this.__generateJS(parsed.args[0], params, math, undef) + ')';
            default:
               return this.__generateJS(parsed.args[0], params, math, undef) + parsed.name;
         }
      } else if (parsed.type === 'prefixOperator') {
         return parsed.name + this.__generateJS(parsed.args[0], params, math, undef);
      } else if (parsed.type === 'separator') {
         let args = [];
         for (let arg of parsed.args) {
            args.push(this.__generateJS(arg, params, math, undef));
         }
         return args.join(parsed.name + ' ');
      } else {
         return parsed.match;
      }
   }

   //#endregion

   //#region : latex to ___

   latexTOmaxima(tex) {
      return this.maximaTOlatex.toMaxima(tex);
   }

   latexTOnode(tex) {
      return this.parserNodeTOnode(this.mathParserLib.parse(this.latexTOmaxima(tex)));
   }

   latexTOjsfunction(tex, params = [], noparse = false) {
      return this.maximaTOjsFunction(this.latexTOmaxima(tex), params, noparse);
   }

   //#endregion

   //#region : maxima(string) to ___

   maximaTOnode(str) {
      return this.parserNodeTOnode(this.mathParserLib.parse(str));
   }
   maximaTOjsFunction(str, params = [], math = 'Math', strict = true) {
      return this.parsedTOjsFunction(this.mathParserLib.parse(str), params, math, strict);
   }

   maximaTOlatex(str) {

   }

   //#endregion

}
