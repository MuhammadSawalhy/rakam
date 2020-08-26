/**
 * Using Parser.js we can do incredible things ::: {<>}
 */
import mathParser from '@scicave/math-parser';
import texParser from '@scicave/math-latex-parser';

class Parser {

   constructor() {

   }

   //#region : latex to ___

   latex2math({tex}) {
      return this.maximaTOlatex.toMaxima(tex);
   }

   latex2node({tex}) {
      return this.parserNodeTOnode(this.mathParserLib.parse(this.latex2math(tex)));
   }

   latex2jsfunction({tex, params = [], noparse = false}) {
      return this.math2jsFunction(this.latex2math(tex), params, noparse);
   }

   //#endregion

   //#region : math(string) to ___

   compileMath({math}) {
      if (math instanceof String){
         math = this.mathparser.parse(math);
      }
      return this.__parsed2mathNode_math(math);
   }

   __parsed2mathNode_math(parserTree) {
      let expr = parserTree;
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

   __getRandom_math(expr) {
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
    * @param {String|this.mathParser.Node} math 
    * @param {Array} params 
    * @param {String} scope is the (object name related to window, default: "Math" or "window.Math" ) containing the functions and the variables that is not a parameter.
    * @param {Boolean} strict
    */
   math2jsFunction({math, params = [], scope = 'Math', header = ""}) {
      
      if (math instanceof String){
         math = this.mathparser.parse(math);
      }

      /// to know the undefined scope varaibles and functions found in the math expression
      /// this help developers to know if the         
      let undef = { vars: [], funcs: [] }; 

      // header may be modifies to add some helper of sub functions
      // in case of the header length increases, "func" will be called
      // to return the ready-to-use function at least.....
      let _return = this.__generateJS_math(math, params, scope, undef, [header]);
      let func = new Function(...params, `${header.join('\n')}\nreturn ${_return};`);
      
      if (header.length > 1){
         func = func();
      }

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

   __generateJS_math(parserTree, params, scope, undef, header) {
      if (parserTree.check('number')) {
         return parserTree.value;
      } else if (parserTree.check('function')) {
         switch (parserTree.name) {
            case 'sum':
               if (!parserTree.args[0].check({ type: 'separator', name: ',', length: 4 }) || !parserTree.args[0].args[1].type === 'variable') throw new Error('sum function has not valid arguments: "' + parserTree.match + '"');
               let sumParam = parserTree.args[0].args[1].name;
               let newParams = [...params];
               newParams.push(sumParam);
               let sumExpr = this.__generateJS_math(parserTree.args[0].args[0], newParams, scope, undef);
               let start = this.__generateJS_math(parserTree.args[0].args[2], params, scope, undef);
               let end = this.__generateJS_math(parserTree.args[0].args[3], params, scope, undef);
               return `(()=>{
                  let _ = 0;
                  for(let ${sumParam} = ${start}; ${sumParam} <= ${end}; ${sumParam}++){
                     _ += ${sumExpr};
                  }
                  return _; 
               })()`;
            default:
               if (params.find(param => parserTree.name === param)) {
                  return parserTree.name + `(${this.__generateJS_math(parserTree.args[0], params, scope, undef)})`;
               }
               if (!window[scope].hasOwnProperty(parserTree.name)) undef.funcs.push(parserTree.name);
               return scope + `.${parserTree.name}(${this.__generateJS_math(parserTree.args[0], params, scope, undef)})`;
         }
      } else if (parserTree.check('id')) {
         if (params.find(param => parserTree.name === param)) {
            return parserTree.name;
         }
         if (!window[scope].hasOwnProperty(parserTree.name)) undef.vars.push(parserTree.name);
         return scope + '.' + parserTree.name;
      } else if (parserTree.check('()')) {
         let opening = "(", closing = ")";
         return opening + this.__generateJS_math(parserTree.args[0], params, scope, undef, header) + closing;
      } else if (parserTree.check('operator')) {
         switch (parserTree.name) {
            case '.':
               return this.__generateJS_math(parserTree.args[0], params, scope, undef) + '.' + parserTree.args[1].match;
            case '^':
               return this.__generateJS_math(parserTree.args[0], params, scope, undef) + ' ** ' + this.__generateJS_math(parserTree.args[1], params, scope, undef);
            case '=':
               return this.__generateJS_math(parserTree.args[0], params, scope, undef) + ' == ' + this.__generateJS_math(parserTree.args[1], params, scope, undef);
            default:
               return this.__generateJS_math(parserTree.args[0], params, scope, undef) + ' ' + parserTree.name + ' ' + this.__generateJS_math(parserTree.args[1], params, scope, undef);
         }
      } else if (parserTree.check('suffixOperator')) {
         switch (parserTree.name) {
            case '!':
               return 'Math.fact(' + this.__generateJS_math(parserTree.args[0], params, scope, undef) + ')';
            default:
               return this.__generateJS_math(parserTree.args[0], params, scope, undef) + parserTree.name;
         }
      } else if (parserTree.check('prefixOperator')) {
         return parserTree.name + this.__generateJS_math(parserTree.args[0], params, scope, undef);
      } else if (parserTree.check('separator')) {
         let args = [];
         for (let arg of parserTree.args) {
            args.push(this.__generateJS_math(arg, params, scope, undef));
         }
         return args.join(parserTree.name + ' ');
      } else {
         return parserTree.match;
      }
   }

   math2latex({math}) {

   }

   //#endregion

}

Parser.prototype.mathParser = mathParser;
Parser.prototype.texParser = texParser;

export default Parser;