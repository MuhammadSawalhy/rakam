import Parser from '../parser/index.js';

let p = new Parser();

it("tests math2js", ()=>{
  expect(p.math2js('1+2-sinx')).toEqual();
});
