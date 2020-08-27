export default function prepareScope(scope, header){
  
  if (scope instanceof Array) {
    header.concat([
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
  }else if (scope && typeof scope == "function"){
    header.concat([
      "// __scicave_rakam_getId__ is a reference to scope function from options",
    ]);
  }else if (scope && typeof scope !== "object") {
    throw new Error('"scope" has to be type of object');
  }

}