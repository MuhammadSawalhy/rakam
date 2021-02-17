import random from './random';

export default function randomInt(start: number, end: number) {
  return Math.round(random(start, end));
}
