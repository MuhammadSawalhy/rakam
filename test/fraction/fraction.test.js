const {quotRem, frac, randomInt, random } = require('rakam');

let tests = [
  {
    fn: quotRem,
    args: [-1.123],
    expected: { s: -1, q: 1, r: 123, d: 1000 },
  },
  {
    fn: quotRem,
    args: [50.1],
    expected: { s: 1, q: 50, r: 1, d: 10 },
  }
];

describe("teset qutoRem method", ()=>{

  tests.forEach(t =>{
    test(t.title || t.fn.name + ": " + t.args, ()=>{
      expect(t.fn(...t.args)).toStrictEqual(t.expected);
    });
  });

  test('quotRem: integer has n = 0, d = 1 and q = the original number', ()=>{
    for(let i=0; i<20; i++) {
      let number = randomInt(-100, 100);
      let qr = quotRem(number);
      expect(qr).toStrictEqual({
        s: Math.sign(number) < 0 ? -1 : 1,
        q: Math.sign(number) * number, // abs
        r: 0,
        d: 1,
      });
    }
  });

  test('frac: process the output of qutoRem', ()=>{
    for(let i=0; i<20; i++) {
      let number = random(-100, 100)
      let v = frac(quotRem(number));
      let e = frac(number);
      if (Object.values(v).filter(v => Object.values(e).indexOf(v) > -1).length < Object.values(v).length) console.log("number>>>>>>>>>>>>>>>>>", number);
      expect(v).toStrictEqual(e);
    }
  });

});
