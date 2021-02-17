/**
 * is thrown when using undefined variables or functions
 * this is thrown in ../parsers/index.js when trying to
 * get compile js function from math or latex
 */
export default class UndefinedUsed extends Error {
  vars: string[];
  funcs: string[];

  constructor(message: string, undef: { funcs: string[], vars: string[] }) {
    super(message);
    this.vars = undef.vars;
    this.funcs = undef.funcs;
  }
}
