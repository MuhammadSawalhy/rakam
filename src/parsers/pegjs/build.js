const pegjs = require('pegjs');
const fs = require('fs');

let options = {
    output: 'source',
    format: 'commonjs'
}

let grammarFiles = ['tex', 'math']; 

grammarFiles.forEach(file=>{
    let grammar = fs.readFileSync(`./src/parsers/pegjs/${file}.pegjs`).toString('utf8');
    let code = pegjs.generate(grammar, options);
    fs.writeFileSync(`./src/parsers/pegjs/${file}.js`, code.replace(/module\.exports = (.*?)$/m, "export default $1"));
});


