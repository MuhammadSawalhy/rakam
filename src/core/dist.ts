import { TypeVector } from '../Vector';

/**
 * get the distance between two point
 * @param a x of the first vector or Vector
 * @param b y of the first vector or Vector
 * @param c x of the second vector or Vector
 * @param d y of the second vector or Vector
 */
export default function dist(
  a: number | TypeVector,
  b: number | TypeVector,
  c?: number,
  d?: number
) {
  if (typeof a === 'object' && typeof b === 'object') {
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
  }
  if (c !== undefined && d !== undefined) {
    return ((a as number - c) ** 2 + (b as number - d) ** 2) ** 0.5;
  } else {
    throw new Error(
      "can't calculate the distance, check that you passed two vectors or 4 numbers x1,y1,x2,y2"
    );
  }
}
