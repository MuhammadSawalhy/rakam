import type { Math2JsHandlingOptions } from '../types';

/**
 * get id as member expression from the scope or params
 * @param id to get it from the scope or params
 * @param options handling options
 */
export function getScopedId(id: string, options: Math2JsHandlingOptions) {
  let { params, scope, undefs, header } = options;

  if (header.idExists(id, false)) {
    throw new Error(`identifier "${id}" is defined before, please change it`);
  } else if (!scope || params.indexOf(id) > -1) {
    return id;
  }

  if (Array.isArray(scope)) {
    let found = false;
    for (let i = 0; i < scope.length; i++) {
      let val = typeof scope[i] === 'function' ? scope[i](id) : scope[id];
      found = val !== undefined;
    }
    if (!found) undefs.vars.push(id);
    // no need for JSON.stringify because math-parser parses valid identifer names for js
    return `${header.scopeId}('${id}')`;
  }
  
  if (typeof scope === 'function') return `${header.scopeId}('${id}')`;

  if (typeof scope === 'object') return header.scopeId + '.' + id;

  // we should return before this line, may something expected happened
  throw new Error(`unexpected error: during compiling the math expression`);
}
