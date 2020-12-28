const {
  geometry: { angles },
  vector,
} = require('rakam');

// the acceptable differencve between the expected
// value and the returned angle from "angles" methods
let error = 0.001;

describe('angles', () => {
  expect.extend({
    toBeAngle(recieved, expected) {
      let pass = recieved > expected - error && recieved < expected + error;
      let msg = pass ? 'The two angles are equal' : 'The two angles differ';
      return { pass, message: msg };
    },

    toBeEquivalentAngle(recieved, expected) {
      recieved = angles.nomalize(recieved);
      expected = angles.normalize(expected);
      let pass = recieved > expected - error && recieved < expected + error;
      let msg = pass ? 'The two angles are equal' : 'The two angles differ';
      return { pass, message: msg };
    },
  });

  test('aliases should refer to the actual functions', () => {
    expect(angles.DMS).toBe(angles.degMinSec);
    expect(angles.strDMS).toBe(angles.strDegMinSec);
    expect(angles.fromDMS).toBe(angles.fromDegMinSec);
    expect(angles.fromStrDMS).toBe(angles.fromStrDegMinSec);
  });

  test('minAngle, vectors', () => {
    let a = angles.minAngle(vector.fromAngle(45, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
    let expectedValue = 90;
    expect(a).toBeAngle(expectedValue);
  });

  test('maxAngle, vectors', () => {
    let a = angles.maxAngle(vector.fromAngle(45, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
    expect(a).toBeAngle(270);
  });

  test('minAngle, lines, { x: 30, y: 30 } and { x: -10, y: 10 ', () => {
    let a = angles.minAngle({ x: 30, y: 30 }, { x: -10, y: 10 }, { type: 'lines' });
    let expectedValue = 90;
    expect(a).toBeAngle(expectedValue);
  });

  test('minAngle, lines, 30 and -45', () => {
    let a = angles.minAngle(vector.fromAngle(30, 1, 'deg'), vector.fromAngle(-45, 1, 'deg'), { type: 'lines' });
    let expectedValue = 75;
    expect(a).toBeAngle(expectedValue);
  });

  test('maxAngle, lines, 30 and -45', () => {
    let a = angles.maxAngle(vector.fromAngle(30, 1, 'deg'), vector.fromAngle(-45, 1, 'deg'), { type: 'lines' });
    let expectedValue = 105;
    expect(a).toBeAngle(expectedValue);
  });

  describe('angle', () => {
    test('vectors::default , ccw::default', () => {
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'));
      let expectedValue = 147;
      expect(a).toBeAngle(expectedValue);
    });

    test('vectors::default, cw', () => {
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), { dir: 'cw' });
      let expectedValue = 213;
      expect(a).toBeAngle(expectedValue);
    });

    test('lines, ccw::default', () => {
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), { type: 'lines' });
      let expectedValue = 147;
      expect(a).toBeAngle(expectedValue);
    });

    test('lines, cw', () => {
      let a = angles.angle(vector.fromAngle(-12, 1, 'deg'), vector.fromAngle(135, 1, 'deg'), {
        type: 'lines',
        dir: '+',
      });
      let expectedValue = 33;
      expect(a).toBeAngle(expectedValue);
    });
  });

  test('degMinSec', () => {
    let a = angles.degMinSec(30.123);
    expect(a.deg).toBe(30);
    expect(a.min).toBe(7);
    expect(a.sec.toString()).toEqual(expect.stringMatching(/^22\.8/));
  });

  test('degMinSec and fromDegMinsec,,, random values', () => {
    for (let i = 0; i < 1000; i++) {
      let r = (0.5 - Math.random()) * 10000;
      let a = angles.fromDegMinSec(angles.degMinSec(angles.toDeg(r), -1));
      expect(a > r - error && a < r + error).toBe(true);
    }
  });

  test('strDegMinSec and fromStrDegMinsec,,, random values', () => {
    for (let i = 0; i < 1000; i++) {
      let r = (0.5 - Math.random()) * 10000;
      let a = angles.fromStrDegMinSec(angles.strDegMinSec(angles.toDeg(r), -1));
      expect(a > r - error && a < r + error).toBe(true);
    }
  });
});
