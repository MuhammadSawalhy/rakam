// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.
{
  options = { autoMult: true, functions: ['sin'] }
  
  class Node{
    constructor(type, args, props){
      Object.assign(this, props);
      this.type = type;
      this.args = args;
    }
  }

  function handleFunction(name, args){
    if(options.functions.filter(func => func === name).length){
      return new Node('function', args, { name });
    } else {
      if (options.autoMult){
        return new Node('*', [new Node('variable', { name }), new Node('()', args)]);
      } else {
        throw {
          message: 'invalid syntax, hint: missing * sign',
          location: location()
        }
      }
    }
  }
}

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* _{
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return new Node('+' , [result, element[3]]); }
        if (element[1] === "-") { return new Node('-' , [result, element[3]]); }
      }, head);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return new Node('*' , [result, element[3]]); }
        if (element[1] === "/") { return new Node('/' , [result, element[3]]); }
      }, head);
    }

Factor
  = _ num:Number? _ name:Name? _ "(" args:Seperator ")" {
      if (name) {
        let a = handleFunction(name, args);
        if (num){
          return new Node('*', [new Node('number', [], { value: num }), a]);
        }
        return a;
      } else if (num){
        if(options.autoMult){
          return new Node('*', [ new Node('number', [], { value: num }), new Node('()', args)]);
        } else {
          throw {
            message: 'invalid syntax, hint: missing * sign',
            location: location()
          }
        }
      }
      return new Node('()', args);
    }
  / _ num:Number _ name:Name {
    if(options.autoMult){
      return new Node('*', [
        new Node('number', [], { value: num }),
        new Node('variable' , [], { name })
      ]);
    } else {
      throw {
        message: 'invalid syntax, hint: missing * sign',
        location: location()
      }
    }
  }
  / _ value:Number { return new Node('number' , [], { value }); }
  / _ name:Name { return new Node('variable' , [], { name }); }


Seperator
  = head:Expression tail:(_ "," _ (Expression))* _{
      if (tail.length){
        return new Node(',', [head].concat(tail.map(a => a[3])));
      }
      return head;
    }


//#region numbers

Number "number"
  = sign:sign? [ ]* num:[0-9]+ [ ]* frac? [ ]* exp? { return parseFloat(text().replace(/\ /g, '')); }

frac
  = "." _ [0-9]+

exp
  = [eE] _ sign? _ [0-9]+

sign
  = '-' / '+'

//////////////

Name "name" 
  = [a-zA-Z_]+ [0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*