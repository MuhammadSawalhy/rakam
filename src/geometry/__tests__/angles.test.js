import angles from "../angles";
import vector from '../../Vector';

// the acceptable differencve between the expected
// value and the return angle from "angles" methods
let error = 0.00001;

describe('angles', ()=>{

  test("minAngle, vectors", ()=>{
    let a = angles.minAngle(vector.fromAngle(angles.toRad(45)), vector.fromAngle(angles.toRad(135)));
    let expectedValue = Math.PI/2;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("maxAngle, vectors", ()=>{
    let a = angles.maxAngle(vector.fromAngle(angles.toRad(45)), vector.fromAngle(angles.toRad(135)));
    let expectedValue = Math.PI/2*3;
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("minAngle, lines, { x: 30, y: 30 } and { x: -10, y: 10 ", ()=>{
    let a = angles.minAngle({ x: 30, y: 30 }, { x: -10, y: 10 }, { type: 'lines' });
    let expectedValue = Math.PI/2;
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("minAngle, lines, 30 and -45", ()=>{
    let a = angles.minAngle(vector.fromAngle(angles.toRad(30)), vector.fromAngle(angles.toRad(-45)), { type: 'lines' });
    let expectedValue = angles.toRad(75);
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("maxAngle, lines, 30 and -45", ()=>{
    let a = angles.maxAngle(vector.fromAngle(angles.toRad(30)), vector.fromAngle(angles.toRad(-45)), { type: 'lines' });
    let expectedValue = angles.toRad(105);
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("degMinSec", ()=>{
    let a = angles.degMinSec(30.123);
    expect(a.deg).toBe(30);
    expect(a.min).toBe(7);
    expect(a.sec.toString()).toEqual(expect.stringMatching(/^22\.8/));
  });

  test("degMinSec and fromDegMinsec,,, random values", ()=>{
    for(let i=0; i<1000; i++){
      let r = (0.5 - Math.random()) * 10000;
      let a = angles.fromDegMinSec(angles.degMinSec(angles.toDeg(r), -1));
      expect(a>r-error && a<r+error).toBe(true);
    }
  });
  
  test("strDegMinSec and fromStrDegMinsec,,, random values", ()=>{
    for(let i=0; i<1000; i++){
      let r = (0.5 - Math.random()) * 10000;
      let a = angles.fromStrDegMinSec(angles.strDegMinSec(angles.toDeg(r), -1));
      expect(a>r-error && a<r+error).toBe(true);
    }
  });

});
