const pegjs = require('pegjs');
const fs = require('fs');
const path = require('path');

let replacer = {
    text:
`module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};`,

    replacement: 
`module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse,
  Node
};`,

};

let options = {
    output: 'source',
    format: 'commonjs',
}

let grammarFiles = [
    {
        name: 'tex',
        dependencies: {
            Node: './texParserNode.js'
        },
    },
    {
        name: 'math',
        dependencies: {
            Node: './mathParserNode.js'
        },
    }
]; 

grammarFiles.forEach(file=>{

    options.dependencies = file.dependencies;

    console.log('compiling>>>>>>>>>>>>>');
    console.log(path.resolve(__dirname, `${file.name}.pegjs`));
    let grammar = fs.readFileSync(path.resolve(__dirname, `${file.name}.pegjs`)).toString('utf8');
    let code = pegjs.generate(grammar, options);
    code = code.replace(replacer.text, replacer.replacement);
    code = code.replace(/\/\*\*#\s*require\s*\(\s*"(.*?)"\s*\)\s*\*\//gm, (m, g)=>{
        return fs.readFileSync(path.resolve(__dirname, g)).toString('utf8');
    });
    console.log('js code:::::::::');
    console.log(path.resolve(__dirname, `${file.name}.js`));
    console.log(); console.log();
    fs.writeFileSync(path.resolve(__dirname, `${file.name}.js`), code);

});

