// we are using rollup-jest transformer
import parser from '../index.js';
import {defaultHandlers} from '../math2js.js';
import generateJs from '../utils/math2js/generateJs.js';

// const path = require('path');
// let pkg = require(path.resolve(process.cwd(), './package.json'));
// let {parser} = require(path.resolve(process.cwd(), pkg.main));


describe("math2js", ()=>{

  it("should return a valid object, {eval: function, code: string}", ()=>{
    let p = parser.math2js('1+2-sinx');
    expect(p).toEqual(expect.any(Object));
    expect(p.eval).toEqual(expect.any(Function));
    expect(typeof p.code).toBe('string');
  });
  
  
  describe("testing options.scope", ()=>{
  
    it("default scope = Math", ()=>{
      let math = '1+2-sinx';
      let x = Math.PI; Math.x = x;
      let value = 1+2-Math.sin(x);
      let p = parser.math2js(math); // scope = window.Math
      expect(p.eval()).toBe(value);
    });
  
    it("scope typeof object", ()=>{
  
      let math = '1+2 - t ';
      let value = -2;
      let scope = {
        t: 5,
      };
      let p = parser.math2js(math, { scope });
      expect(p.eval()).toBe(value);
  
    });
  
    it("scope typeof function", ()=>{
      let math = '1+2-sinx';
      let value = 1+2-1;
      let scope = function getId(id){
        let vars = { x: 90, sin(x){ return Math.sin(x*Math.PI/180) } };
        return vars[id];
      };
      let p = parser.math2js(math, { scope });
      expect(p.eval()).toBe(value);
    });
  
    it("scope typeof array", ()=>{
  
      // to compute sin of angle in degrees not radians,
      // we can use ahndlers or scope for this purpose
      // but now, we are going to pass scope as function
      let math = 'y t -sinx +z';
      let value = 4*1 -0    +1;
  
      let scope = [
        { t: 1, x: 180, },
        { x: 3, y: 4 },
        function getId(id){
          let vars = { z: 1, sin(x){ return Math.sin(x*Math.PI/180) } };
          return vars[id];
        }
      ];
  
      let p = parser.math2js(math, { scope }); // scope = window.Math
      expect(p.eval()).toBe(value);
  
    });
  
  });
  
  
  describe("testing options.handlers", ()=>{
  
    it('"sum" function handler, instead of the default', ()=>{
  
      let math = '1+2-sum(123)';
      let value = -2;
      let handlers = defaultHandlers.filter(a => a !== 'sum');
  
      // the global
      self.newSum = ()=>{
        return 5;
      };
  
      handlers.push({
  
        // node is instance of p.mathParser.Node, see: https://www.npmjs.com/package/@scicave/math-parser
        test(node){
          return node.check({ type: 'function', name: 'sum' });
        },
  
        handle(parserTree, options){
          // options that has been passed to math2js -> generateJs function
          // but options.parserTree = node that has passed this.test not the top most Node
          return 'newSum()'
        }
  
      });
  
      let p = parser.math2js(math, { handlers });
  
      expect(p.eval()).toBe(value);
  
    });
    
    it('arbitrary function handler', ()=>{
  
      let math = '1+2-asd(123)';
      let value = 1+2-123;
      let handlers = [];
  
      // the global
      self.asd = (input)=>{
        return input; // 123
      };
  
      handlers.push({
        // node is instance of p.mathParser.Node, see: https://www.npmjs.com/package/@scicave/math-parser
        test(node){
          return node.check({ type: 'function', name: 'asd' });
        },
        handle(parserTree, options){
          // options that has been passed to math2js -> generateJs function
          // but options.parserTree = node that has passed this.test not the top most Node
          let args = [];
          parserTree.args.forEach(pt =>{
            args.push(generateJs(pt, options));
          });
          return `asd(${args.join(', ')})`;
        }
      });
  
      let p = parser.math2js(math, { handlers }, { singleCharName: false, functions: ['asd'] });
      console.log('-------------------------------\n', p.code);
  
      expect(p.eval()).toBe(value);
  
    });
  
  });

});
