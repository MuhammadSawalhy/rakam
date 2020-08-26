
/**
 * is thrown when using undefined variables or functions 
 * this i s thrown in ../parsers/index.js when trying to 
 * get js function from math or latex
 */
export default class UndefinedUsed extends Error {
  constructor(message, undef){
    super(message);
    this.vars = undef.vars;
    this.funcs = undef.funcs;
  }
}