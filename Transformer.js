class sNode {
   /**
    * @param {string} type is a on of these
    *  'id', 'func', 'num', 'bool_op', 'binray_op', 'bool', op = {'+', '-', '*', '/', '^', '=', ...}
    * 
    * @param {*} args array of sNode
    * @param {*} attributes object contains attributes names and values.
    */
   constructor(type, args = [], attributes = {}) {
      Object.assign(this, attributes);      
      if (type === 'op') {
         let boolOps = ['and', 'or', 'xor', 'not', '&&', '||', '!'];
         if (this.__contains(this.name, ...boolOps)) {
            this.type = 'bool_op';
         }
         else if (this.name == ' ==') {
            this.type = 'assign_op';
         }
         else {
            this.type = type;
         }
      } else {
         this.type = type;
      }
      this.args = args;
      if (this.type === 'id') {
         if (this.name === 'true' || this.name === 'false') {
            this.type = 'bool';
         }
      }
   }

   get isLiteral() {
      return this.type === 'literal';
   }

   calls(type, argsCount = this.args.length, type_ = this.type) {
      return (this.type === type || (this.type === 'func' && this.name === type) || (this.type === 'op' && this.name === type)) && this.args.length === argsCount && this.type === type_;
   }

}

MathPackage.Transformer = {
   
   defaultOptions: {
      functions: ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'sinh', 'cosh',
         'tanh', 'sech', 'csch', 'coth', 'asin', 'acos', 'atan', 'asec', 'acsc',
         'acot', 'asinh', 'acosh', 'atanh', 'asech', 'acsch', 'acoth', 'exp',
         'ln', 'log', 'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth', 'exp', 'ln',
         'log', 'floor', 'ceil', 'abs', 'random', 'constrain', 'clamp', 'gcm',
         'hcm', 'gcf', 'hcf', 'gcd', 'hcd', 'lcm', 'lcd', 'max', 'min', 'root',
         'sqrt', 'sin', 'sum', 'integral', 'derivative', 'in'
      ],
      prefixOperators: ['!', 'not', '~', '++', '--', '+', '-', 'bnot'],
      suffixOperators: ['!', '++', '--'],
      operators: [
         [
            { name: '!', type: 'preop', options: { for: ['var'] } },
            { name: '--', type: 'preop', options: { for: ['var'] } },
         ],

         // [
         //    { name: '++', type: 'preop', options: { except: ['num'] } },
         //    { name: '--', type: 'preop', options: { except: ['num'] } },
         //    { name:  '!', type: 'preop', options: { except: ['num'] } },
         // ],

         [{ name: '^', type: 'op' }],

         [
            { name: '*', type: 'op' },
            { name: '/', type: 'op' }
         ],

         [
            { name: 'mod', type: 'op' }
         ],

         [
            { name: '+', type: 'op' },
            { name: '-', type: 'op' }
         ],

         [
            { name: '>>', type: 'op' },
            { name: '<<', type: 'op' }
         ],

         [
            { name: '>=', type: 'op' },
            { name: '<=', type: 'op' },
            { name: '!=', type: 'op' },
            { name: '=', type: 'op' },
            { name: '<' },
            { name: '>' },
            { name: '==' }
         ],

         [
            { name: '&', type: 'op' },
            { name: 'band', type: 'op' },
            { name: '|', type: 'op' },
            { name: 'bor', type: 'op' },
            { name: 'bxor' },
            { name: 'constrain' }
         ],

         [
            { name: 'in', type: 'op' },
            { name: 'out', type: 'op' }
         ],

         [
            { name: 'xnor', type: 'op' },
            { name: 'xor', type: 'op' },
            { name: 'nand', type: 'op' },
            { name: 'nor', type: 'op' },
            { name: 'or', type: 'op' },
            { name: 'and', type: 'op' },
            { name: '||', type: 'op' },
            { name: '&&', type: 'op' }
         ],

         [{ name: '=', type: 'op' }]
      ],
      forbiddenSymbols: '\$,@,\\\\,#'.split(',')
   },

   //#region  sNode
   
   snodeTOnode: function (snode){

      let _getRandom = (expr) => {
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

      let expr = snode;
      if (expr.type === 'num') {
         return new Constant(parseFloat(expr.value));
      } else if (expr.type === 'id')
         return new Variable(expr.value);
   
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
               return new Variable(expr.extension)
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
   
   },
   
   //#endregion
   
   //#region : dealing with latex
   latexTOstring: function (tex){
      let options = {};
      const converter = new TeX2Max(options);
      const str = converter.toMaxima(tex);
      console.log(str);
      return str;
   },
   
   latexTOsnode: function (tex){
      return stringTOsnode(latexTOstring(tex));
   },
   
   latexTOnode: function (tex){
      return snodeTOnode(latexTOsnode(tex));
   },
   //#endregion
   
   //#region : dealing with string
   
   /** options include:
    * functions:: if is is applied the expr " 1 + rg(2)" will be considered as " 1 + rg*(2)", thus rg is constants, here we sill consider the functions you insert in addtion to the common functions such as ['sin', 'cos', ...]
    */
   stringTOsnode: function (str, options, operations = null) {

      options = {} || options; /// for ensuring that options has a value for the next step.
      options = {...defaultOptions, ...options}

      //#region pre codes
      var operators = options.operators;
      operators = operators.reverse().flat();
      var prefixOperators = options.prefixOperators;
      var suffixOperators = options.suffixOperators;
      // checking errors
      var sendError = function (msg, pos) {
         throw new Error(msg + '\n' + str + '\n' + new Array(pos).fill('_').join('') + '^');
      }
      let forbiddenSymbols = options.forbiddenSymbols;
      if (!operations) {
         if (this.__contains(str, ...forbiddenSymbols)) sendError('forbidden symbol.');
      }
      
      operations = operations || []; /// if you put this line before the direct last if statement, if statement will be ignored, or the inside code won't be processed
   
      var snode;
   
      // if empty of characters
      str.replace(/^\s*$/, () => {
         snode = new sNode('');
      }); if (snode) return snode;
   
      // str.replace(
      //     new RegExp(`(${operators.flat().map(op => isAlpha(op)? `[\W]` : '\\' + op).join('|')})`, 'g'),
      //     " $1 "
      // );
   
      //#endregion
   
      //#region brackets

      var brackets = {
         values: [
            { openingChar: '{', closingChar: '}', num: 0, opened: false }, /// multiNodable used to know whether or not the bracket block can have multiNode seperated be something like comma ","
            { openingChar: '[', closingChar: ']', num: 0, opened: false },
            { openingChar: '(', closingChar: ')', num: 0, opened: false },
            { openingChar: '"', closingChar: '"', num: 0, opened: false },
            { openingChar: "'", closingChar: "'", num: 0, opened: false }
         ], /// we can deal with quotes with the same procedures as the brackets.
         index: undefined, opendBracket: null
      };
      
      for (let i = 0; i < str.length; i++) {
         
         for (let b of brackets.values) {
            let c = str[i];
            if (c === b.openingChar) {
               b.num++;
               if (!brackets.index || brkts.index === 0) { /// if not open, then open
                  b.opened = true;
                  brackets.opendBracket = b;
                  brackets.index = i;
               }
            } else if (c === b.closingChar) {
               b.num--;
            }        
         }

         for (let b of brackets.values) {
            
            /// when a bracket is close, but not opened. e.g. ::: " 1+2-5) "
            if (b.num < 0) {
               sendError('error on brackets.', i);
            }
      
            /// if true, the bracket's block is defined.
            if (b.num === 0 && b.opened) { /// may other brackets' num be zero, as it does not exist or as it is closed but it closed inside the block that we are setting,,, e.g.::: " 1+2({1,2,3}^-1) "
               //// checking error,,, this ill be done on handling for the bracket's content, so don't do for this. 
               // if (brkts['['].num > 0) { sendError('bracket ] is missed.', i - 1); }
               // if (brkts['('].num > 0) { sendError('bracket ) is missed.', i - 1); }
               let name = '$$' + this.__getRandomName() + '$$';
               let str_ = str.slice(brkts.index + 1, i); /// cut the text from the next sibiling of the opened bracket until the current closingChar index
               str = str.replace(b.openingChar + str_ + b.closingChar, name); // replacing here is not global, so if there was identical bracket it won't be replaced, if so, there was no problem.
               i = str.search(name) + name.length; /// setting the index, as the string may shrink or be taller, it depends on the length of the name
               let snChild = stringTOsnode(str_, options); /// getting the sNode from the string inside this bracket block with the same procedures.
               let sn = new sNode(b.openingChar + b.closingChar, name, [snChild]);
               operations.push({ name: name, sNode: sn });
               b.opened = false; brackets.index = undefined; b.opendBracket = null; // reset
            }

         }
         
      }
      /// after finishing looping searching for brackets blocks, oooops, what is this?!!!, oh, the bracket is not closed. send an error
      if (brackets.opendBracket) {
         sendError('bracket is not closed.', str.length);
      }

      //#endregion
   
      //#region final codes

      // now I have my brackets stored in brackets array and replaced their blocks with their names.
      
      //if (!this.__contains(str, ...operators)) str = str.replace(/\s/g, '');
      let multiNode = [',', ';'];
      for (let m of multiNode) {
         if (this.__contains(str, m)) {
            let args = [];
            let strs = str.split(m);
            for (let str_ of strs) {
               args.push(stringTOsnode(str_, options, operations));
            }
            return new sNode(m, args, { length: args.length });
         }
      }

      //'1+ #asdas ! * sin(x)'
      for (let sufop of suffixOperators) {
         // let regex = new RegExp(`\^\\s*(.*)\\${sufop.toString()}(.*)\\s*\$`);
         // while (str.search(regex) > -1) {
         //    str.replace(regex, (match, arg) => {
               
         //    });
         // }
      }
      
      for (let preop of prefixOperators) {
         
      }
   
      let rep1 = (op) => {
         return (match, arg1, a, a1, arg2) => {
            let name = '$$' + this.__getRandomName() + '$$';
            let sn = new sNode('op', [stringTOsnode(arg1, options, operations), stringTOsnode(arg2, options, operations)], { name: op.toString() });
            operations.push({ name: name, sNode: sn });
            return name;
         }
      };
      let rep2 = () => {
         return (match, arg1, arg2) => {
            let name = '$$' + this.__getRandomName() + '$$';
            let sn = new sNode('op', [stringTOsnode(arg1, options, operations), stringTOsnode(arg2, options, operations)], { name: op.toString() });
            operations.push({ name: name, sNode: sn });
            return name;
         };
      };

      for (let op of operators) {
         if (this.__contains(str, op)) {
            let regex = new RegExp(`\^\\s*(.*)\\${op.toString()}(.*)\\s*\$`);
            if (isAlpha(op)) {
               regex = new RegExp(`\^\\s*((.*)\\s+|(.*[^A-Z^a-z])\\s*)${op.toString()}(\\s*([^A-Z^a-z].*)|\\s+(.*))\\s*\$`);
               str = str.replace(regex, rep1(op));
            } else {
               str = str.replace(regex, rep2(op));
            }
         }
      }
   
      if (!this.__contains(str, operators)) {
        
         // if function like sin#asd123, notice that #asd123 was the bracket (...)
         str.replace(/^\s*([_a-zA-z]+\d*)\s*(\$\$[_a-zA-z]+\d*\$\$)\s*$/, (match, funcName, funcArgs) => {
            if (match) {
               let args = this.__getOperation(funcArgs, operations);
               if (args.sNode.calls('()')) {
                  snode = new sNode('func', args.sNode.args, { name: funcName });               
               }
            }
         });
         if (snode) return snode;
   
         // if name of operation
         str.replace(/^\s*(\$\$[_a-zA-z]+\d*\$\$)\s*$/, (match, opName) => {
            if (match) {
               snode = this.__getOperation(opName, operations).sNode;
            }
         });
         if (snode) return snode;
   
         // something.func
         str.replace(/^\s*(.*)\.(([_a-zA-z]+\d*)\s*(\$\$[_a-zA-z]+\d*\$\$))\s*$/, (match, first, a, funcName, funcArgs) => {
            if (match) {
               let args = this.__getOperation(funcArgs, operations);
               let func;
               if (args.sNode.calls('()')) {
                  func = new sNode('func', args.sNode.args, { name: funcName });
               }
               if (func) {
                  snode = new sNode('.', [stringTOsnode(first, options, operations), func], { dotType: 'func', extension: first + `.${funcName}` });               
               }
            }
         })
         if (snode) return snode;
   
         //something.id
         str.replace(/^\s*(.*)\.(\$\$[_a-zA-z]+\d*\$\$)\s*$/, (match, first, id) => {
            if (match) {
               snode = new sNode('.', [stringTOsnode(first, options, operations), new sNode('id', [], { name: id })], { dotType: 'id', extension: match });
            }
         })
         if (snode) return snode;
   
         // if literal, number or variable or bool {true or false}, ...
         str.replace(/^\s*(([_a-zA-z]+)\d*)\s*$/, (match, value, notNum) => {
            if (match) {
               snode = new sNode(notNum ? 'id' : 'num', [], { value: value });
            }
         })
         if (snode) return snode;
         str.replace(/^(-?\d+\.?\d*)|(-?\d*\.?\d+)$/, (match, value, notNum) => {
            if (match) {
               snode = new sNode(notNum ? 'id' : 'num', [], { value: value });
            }
         })
         if (snode) return snode;
   
      }
      throw new Error('invalid script.');
      //#endregion
   
   },

   stringTOnode: function (str){
      let snode = stringTOsnode(str, {});
      return snodeTOnode(snode);
   },
   
   stringTOjs: function (params, str){
      return new Function(...params, `return ${str}`);
   },
   
   stringTOlatex: function (str){
      
   },
   
   //#endregion

   //#region helper function

   __contains: function (str, ...texts){
      for (let i = 0; i < str.length; i++) {
         for (let ii = 0; ii < texts.length; ii++) {
            if (i + texts[ii].length < str.length && str.slice(i, i + texts[ii].length) === texts[ii]) return true;
         }
      }
      return false;
   },

   __getOperation: function (name, operations){
      for (let op of operations) {
         if (op.name === name) {
            return op;
         }
      }
   },

   __randomNameNum: 0,
   __getRandomName: function(){
      let num = 0;
      return (Date.now() + this.__randomNameNum++).toString(36)
         .replace(new RegExp(num++, 'g'), 'a') /// Ia ma using Regex for global replacement.
         .replace(new RegExp(num++, 'g'), 'b')
         .replace(new RegExp(num++, 'g'), 'c')
         .replace(new RegExp(num++, 'g'), 'd')
         .replace(new RegExp(num++, 'g'), 'e')
         .replace(new RegExp(num++, 'g'), 'f')
         .replace(new RegExp(num++, 'g'), 'g')
         .replace(new RegExp(num++, 'g'), 'h')
         .replace(new RegExp(num++, 'g'), 'i')
         .replace(new RegExp(num++, 'g'), 'j');
   },

   //#endregion

}
