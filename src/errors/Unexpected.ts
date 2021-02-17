/**
 * is thrown when using undefined variables or functions
 * this is thrown in ../parsers/index.js when trying to
 * get compile js function from math or latex
 */
export default class Unexpected extends Error {
  constructor(msg: string) {
    super(`unexpected error: ` + msg);
  }
}
