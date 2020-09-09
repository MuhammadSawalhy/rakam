import angles from "../angles";
import vector from '../../vector';

// the acceptable differencve between the expected
// value and the return angle from "angles" methods
let error = 0.001;

describe('angles', ()=>{

  test("aliases are referencess to the main functions", ()=>{
    expect(angles.DMS).toBe(angles.degMinSec);
    expect(angles.strDMS).toBe(angles.strDegMinSec);
    expect(angles.fromDMS).toBe(angles.fromDegMinSec);
    expect(angles.fromStrDMS).toBe(angles.fromStrDegMinSec);
  });

  test("minAngle, vectors", ()=>{
    let a = angles.minAngle(vector.fromAngle(45, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
    let expectedValue = 90;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("maxAngle, vectors", ()=>{
    let a = angles.maxAngle(vector.fromAngle(45, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
    let expectedValue = 270;
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("minAngle, lines, { x: 30, y: 30 } and { x: -10, y: 10 ", ()=>{
    let a = angles.minAngle({ x: 30, y: 30 }, { x: -10, y: 10 }, { type: 'lines' });
    let expectedValue = 90;
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("minAngle, lines, 30 and -45", ()=>{
    let a = angles.minAngle(vector.fromAngle(30, 1, 'deg'), vector.fromAngle(-45, 1, 'deg'), { type: 'lines' });
    let expectedValue = (75);
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  test("maxAngle, lines, 30 and -45", ()=>{
    let a = angles.maxAngle(vector.fromAngle(30, 1, 'deg'), vector.fromAngle(-45, 1, 'deg'), { type: 'lines' });
    let expectedValue = (105);
    let error = 0.00001;
    expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
  });

  describe("angle", ()=>{

    test('vectors::default , ccw::default', ()=>{
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
      let expectedValue = 147;
      expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
    });

    test('vectors::default, cw', ()=>{
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), { dir: 'cw' });
      let expectedValue = 213;
      expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
    });

    test('lines, ccw::default', ()=>{
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), { type: 'lines' });
      let expectedValue = 147;
      expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
    });

    test('lines, cw', ()=>{
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), { type: 'lines', dir: '+' });
      let expectedValue = 33;
      expect(a > expectedValue-error && a < expectedValue+error ).toBe(true);
    });

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
