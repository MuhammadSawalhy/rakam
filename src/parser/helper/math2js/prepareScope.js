export default function prepareScope(scope, header){
  
  let args = [scope];

  if (typeof scope === "string"){
    args = [];
  } else if (scope instanceof Array) {
    header.push(...[
      "function __scicave_rakam_getId__(id) {",
      "  if (scope[0].hasOwnProperty(id)) {",
      "    return scope[0][id];",
      ...new Array(scope.length - 1).map((s, i) => `  } else if (scope[${i}].hasOwnProperty(id)) {\n    return scope[${i}][id];`).concat(["  }"]),
      "}",
    ]);
    // another way to do this
    // header.push([
    //    "function __scicave_rakam_getId__(id) {",
    //    "  for (let i = 0; i < scope.length; i++) {",
    //    "    if(scope[i].hasOwnProperty(id)) return scope[i][id];",
    //    "  }",
    //    "}",
    // ].join('\n'));
  } else if (scope && typeof scope == "function"){
    header.push(...[
      "// __scicave_rakam_getId__ is a parameter of the outer function",
    ]);
  } else if (typeof scope === "object") {
    header.push(...[
      "// scope is the passed object to math2js or by default is Math",
    ]);
  } else if (scope){
    // a number
    throw new Error('"scope" has to be type of object, string, or function!');
  }
  
  return args;

}