{
  options = Object.assign({
    autoMult: true,
    functions: [],
    singleCharName: true,
    operatorNames: // this is for something like this: \operatorname{floor}
      ["floor", "ceil", "round", "random", "factorial", "sech", "csch", "coth", "abs"],
         
    builtInNames: [
      "alpha", "Alpha", "beta", "Beta", "gamma", "Gamma", "pi", "Pi", "varpi", "phi", "Phi",
      "varphi", "mu", "theta", "vartheta", "epsilon", "varepsilon", "upsilon", "Upsilon",
      "zeta", "eta", "Lambda", "lambda", "kappa", "omega", "Omega", "psi", "Psi",
      "chi", "tau", "sigma", "Sigma", "varsigma", "rho", "varrho", "Xi", "xi", "nu",
      "imath", "jmath", "ell", "Re", "Im", "wp", "Nabla", "infty", "aleph", "beth",
      "gimel", "comicron", "iota", "delta", "thetasym", "omicron", "Delta", "Epsilon",
      "Zeta", "Eta", "Theta", "Iota", "Kappa", "Mu", "Nu", "Omicron", "Rho", "Tau", "Chi"
    ]
  }, options); /// override the default options
  
  class Node{
    constructor(type, args, props){
      Object.assign(this, props);
      this.type = type;
      this.args = args;

      if(options.singleCharName){
        if(type === "id"){
          for(let c in props.name){
            let result
          }
        }
      }
    }

  }
}

Expression "expression" = Operation1

Operation1 "operation or factor" = 
  head:Operation2 tail:(_ ("=" / "\\" title:texOperators1 !char { return title; }) _ Operation2)* _{
    return tail.reduce(function(result, element) {
      return new Node(element[1] , [result, element[3]]);
    }, head);
  }

texOperators1 = "approx"/ "leq"/ "geq"/ "neq"/ "gg"/ "ll"/ "notin"/ "ni"/ "in"

Operation2 "operation or factor" =
  head:Operation3 tail:(_ ("+" / "-") _ Operation3)* _{
    return tail.reduce(function(result, element) {
      return new Node(element[1] , [result, element[3]]);
    }, head);
  }

Operation3 "operation or factor" =
  head:Operation4 tail:(_ ("*" / "/" / "\\cdot" !char { return "*"; }) _ Operation4)* {
    return tail.reduce(function(result, element) {
      return new Node(element[1] , [result, element[3]]);
    }, head);
  }

Operation4 "operation or factor" =
  head:(Operation5) tail:(_ (operation5WithoutNumber))* {
    if(options.autoMult){
      return tail.reduce(function(result, element) {
        return new Node("*" , [result, element[1]]);
      }, head);
    } else {
      throw {
        message: 'invalid syntax, hint: missing * sign',
        location: location()
      }
    }
  }
  
operation4Simple "operation or factor" =
  head:(operation5Simple) tail:(_ operation5Simple)* {
    if(options.autoMult){
      return tail.reduce(function(result, element) {
        return new Node("*" , [result, element[1]]);
      }, head);
    } else {
      throw {
        message: 'invalid syntax, hint: missing * sign',
        location: location()
      }
    }
  }
  
Operation5 "operation or factor" =
  base:Factor _ exp:SuperScript? _ fac:factorial? {
    if (exp) base = new Node('^', [base, exp]);
    if (fac) base = new Node('!', [base]);
    return base;
  }

operation5WithoutNumber "operation or factor" =
  base:factorWithoutNumber _ exp:SuperScript? _ fac:factorial? {
    if (exp) base = new Node('^', [base, exp]);
    if (fac) base = new Node('!', [base]);
    return base;
  }

operation5Simple =
  base:simpleFactor _ exp:SuperScript? _ fac:factorial? {
    if (exp) base = new Node('^', [base, exp]);
    if (fac) base = new Node('!', [base]);
    return base;
  }

Factor
  = factorWithoutNumber / Number

factorWithoutNumber =
  Functions / Block_Parentheses / Block_VBars /
  Name / TexEntities

simpleFactor =
  Number/ Block_VBars /* || === abs() */ /
  Name / TexEntities /* \theta, \sqrt{x}, \int, ... */

Seperator
  = head:Expression tail:(_ "," _ (Expression))* _{
      if (tail.length){
        return new Node(',', [head].concat(tail.map(a => a[3])));
      }
      return [head];
    }

Functions "functions" =
  BuiltInFunctions / Function

BuiltInFunctions =
  "\\" name:(
    n:builtInFuncsTitles !char {return n;} /
    "operatorname" _ n:("{" _ n:OperatorName "}" {return n;} / char){
      if(!options.operatorNames.includes(n))
        throw {message: "function name \"" + n + "\" is invalid!", location: location()};
      return n;
    }
  ) _ exp:SuperScript? _ arg:builtInFunctionsArg {
    let func = new Node('function', [arg], {name, isBuiltIn:true});
    if(!exp) return func;
    else return new Node('^', [func, exp]);
  }

builtInFunctionsArg = Functions / Block_Parentheses / operation4Simple

Function = 
  name:Name &{ if(options.functions.includes(name)) return true; } _ parentheses:Block_Parentheses 
  { return new Node('function', parentheses.args, { name }); }

Block_Parentheses =
  args:("(" s:Seperator ")" {return s;} / "\\left(" s:Seperator "\\right)" {return s;})
  { return new Node('()', args); }

Block_VBars =
  expr:("|" e:Expression "|" {return e;} / "\\left|" e:Expression "\\right|" {return e;})
  { return new Node('||', [expr]) }

////// main factor, tokens

TexEntities =
    SpecialTexRules / SpecialSymbols / DoubleBlock / SingleBlock

DoubleBlock = "\\" title:doubleBlockTitles !char _ 
  args:(frst:arg _ scnd:arg { return [frst, scnd]; })
  { return new Node("doubleblock", args, {title}); }

SingleBlock =
  "\\" title:singleBlockTitles !char _  arg:arg 
  { return new Node("singleblock", [arg], {title}); }

SpecialSymbols = "\\" name:specialSymbolsTitles !char {
  return new Node('id', [], {name, isBuiltIn:true})
}

arg "function argument"= CurlyBrackets / TexEntities / block_one_char

SuperScript "superscript"= "^" _ arg:arg {return arg;}
SubScript "subscript"= "_" _ arg:arg {return arg;}

block_one_char "digit or char" = [a-z0-9]i {
    let txt = text();
    if(/[a-z]/i.test(txt)){
      return new Node("id", [], { name: txt });
    } else if(/[0-9]/.test(txt)) {
      return new Node("number", [], {value:parseFloat(txt)});
    }
  } / SpecialSymbols;


/////////// special tex rules

SpecialTexRules = Sqrt / Integeral

Sqrt =  "\\sqrt" !char _
        exp:SquareBrackets? _
        arg:arg
  {
    exp = exp || new Node('number', [], {value:2});
    return new Node('function', [exp, arg], {name:'sqrt'});
  }

Integeral = "\\int" !char _
        from:SubScript? _
        to:SuperScript
  {
    exp = exp || new Node('number', [], {value:2});
    return new Node('function', [exp, arg], {name:'sqrt'});
  }

///////// numbers

Number "number"
  = sign:sign? _ $SimpleNumber {
    let value = parseFloat(text().replace(/[ \t\n\r]/g, ''));
    return new Node('number', [], {value});
  }

SimpleNumber "number"
  = (num:[0-9]([0-9]/s)* frac? / frac) {
    let value = parseFloat(text().replace(/[ \t\n\r]/g, ''));
    return new Node('number', [], {value});
  }

frac
  = "." _ [0-9]([0-9]/s)*

sign
  = '-' / '+'

//////////////

Name "name" = (
    mini_name sub:(_ "_" _ ("{" _ w(w/s)* "}" / w))?
  ) {
    let name = text().replace(/[\s\{\}]*/g, ''); 
    return new Node('id', [], {name})
  }

mini_name =
  &{ return options.singleCharName } char /
  char(char / s)* ([0-9] / s)*

OperatorName = 
  ( mini_operator_name _ "_" _ "{" sub:(_ w(w/s)*) "}"
  / mini_operator_name _ "_" _ sub:w
  / mini_operator_name ) {
    return text().replace(/[\s\{\}]*/g, ''); 
  }
  
mini_operator_name = char(char / s)* ([0-9] / s)*

SquareBrackets = "[" _ expr:Expression "]" { return expr; }
CurlyBrackets = "{" _ expr:Expression "}" { return expr; }
///// primitives

w "letter or digit" = [a-zA-Z0-9]

char "letter"  = [a-z]i

nl "newline" = "\n" / "\r\n" / "\r" / "\u2028" / "\u2029"

sp "space or tab"= [ \t]

s "whitespace" = nl / sp

escapedSpace = "\\ "

_ "whitespace"
  = (nl !nl / sp / escapedSpace)*

///////////////////// definitions

builtInFuncsTitles =
  "sin"       / "cos"     / "tan"     / "sec"     / "csc"     / "cot"     /
  "arcsin"    / "arccos"  / "arctan"  / "arcsec"  / "arccsc"  / "arccot"  /
  "sinh"      / "cosh"    / "tanh"    / "ln"

doubleBlockTitles = "frac"

singleBlockTitles = "sqrt"

specialSymbolsTitles = [a-z]i+
  {
    let name = text();
    if(options.builtInNames.includes(name)) return name;
    throw { message: 'undefined name "' + name + '"', location: location() }
  }
  

factorial = "!" 
