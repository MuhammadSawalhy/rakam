import { Scope } from '../types';
import HeaderUtils from './HeaderUtils';

export default function prepareScope(scope: Scope, header: HeaderUtils): [string[], any[]] {
  let outerFuncArgs = [scope];
  // make sure it is not a param to the inner func
  // getRandomId will make sure that
  const scopeId = header.getRandomId();
  let outerFuncParams: string[] = [scopeId];

  header.scopeId = scopeId;
  // make usre to add to header.declaredVars
  header.declaredVars.push(scopeId);

  // this (if array) has to be before typeof scope === 'object'
  if (Array.isArray(scope)) {
    let getIdFunc = [
      'function __scicave_rakam_getId__(id) {',
      `  for(let s of ${scopeId})`,
      '    if ((a = s[id]) !== undefined) return a;',
      // undefined may work but let it be more coherent with NaN;
      '  return NaN;',
      '}',
    ];
    header.add.declareVar('a');
    header.pushLines(...getIdFunc);
    header.declaredFuncs.push('__scicave_rakam_getId__');
  }
  else if(typeof scope !== 'object' || typeof scope !== 'function') {
    // a number
    throw new Error('"scope" has to be type of Object, Function, Array<Object|Function>');
  }

  return [outerFuncParams, outerFuncArgs];
}

