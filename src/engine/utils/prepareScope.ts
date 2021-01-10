export default function prepareScope(scope, header) {
  let args = [scope];

  if (typeof scope === 'string') {
    args = [];
  } // this (else if) has to be before typeof scope === 'object'
  else if (scope instanceof Array) {
    if (scope.length === 0) {
      throw new Error('scope array has nop items, make sure you passed array with at least one valid item');
    }

    let temp = [
      "  else if (typeof scope[0] === 'object' && scope[0].hasOwnProperty(id)) {",
      '    return scope[0][id];',
      '  }',
      "  else if (typeof scope[0] === 'function' && (a = scope[0](id)) && a !== undefined) {",
      '    return a;',
      '  }',
    ];

    header.push('function __scicave_rakam_getId__(id) {');
    header.push(temp[0].replace('else if', 'if'), ...temp.slice(1)); // for scope at index: 0
    for (let i = 1; i < scope.length; i++) {
      // for scope at index: 1, ...
      header.push(...temp.map((t) => t.replace(/scope\[0\]/g, `scope[${i}]`)));
    }
    header.push('  else {');
    header.push("    throw new Error('the scope array has no valid scope in it.');");
    header.push('  }'); // close all the (if, else if, else) statement
    header.push('}'); // close the function __scicave_rakam_getId__

    header.addedFuncs.push('__scicave_rakam_getId__');
  } else if (scope && typeof scope == 'function') {
    header.push('// __scicave_rakam_getId__ is a parameter of the outer function = options.scope function');
  } else if (typeof scope === 'object') {
    header.push('// scope is object passed to math2js (options.scope), otherwise: by default is Math');
  } else if (scope) {
    // a number
    throw new Error('"scope" has to be type of object, string, or function!');
  }

  return args;
}
