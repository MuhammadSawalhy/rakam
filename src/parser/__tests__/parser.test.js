import parser from '../parser/index.js';

// const path = require('path');
// let pkg = require(path.resolve(process.cwd(), './package.json'));
// let {parser} = require(path.resolve(process.cwd(), pkg.main));

it("math2js return valid object", ()=>{
  let p = parser.math2js({ math: '1+2-sinx' });
  expect(p).toEqual(expect.any(Object));
  expect(p.eval).toEqual(expect.any(Function));
  expect(typeof p.code).toBe('string');
});


it("math2js: pass no scope, use the default", ()=>{
  let math = '1+2-sinx';
  let x = Math.PI; Math.x = x;
  let value = 1+2-Math.sin(x);
  let p = parser.math2js({ math });
  expect(p.eval()).toStrictEqual(value);
});

