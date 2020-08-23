let texParser = require('./math.js');

function testTex(tex) {
  console.log("parsing:", tex);
  try {
    let tree = texParser.parse(tex);
    console.log(JSON.stringify(tree, null, 2));
  } catch (e) {
    if (e instanceof texParser.SyntaxError) {
      console.log("SyntaxError:", e.message);

      let i = e.location.start.line - 1;
      let lines = tex.split('\n');

      let log = function (){
        if (i - 2 > -1) 
        console.log(lines[i - 2]);
        if (i - 1 > -1) 
        console.log(lines[i - 1]);
        console.log();
        console.log(lines[i]);
        console.log((new Array(e.location.start.column - 1)).fill("_").join('') + "^");
        console.log();
        if (i + 1 < lines.length) 
        console.log(lines[i + 1]);
        if (i + 2 < lines.length) 
        console.log(lines[i + 2]);
      }

      log();

    } else {
      throw e;
    }
  }
}

function test() {
  console.log('testing parser >>>>>>>>>>>>>>');

  testTex(`x^ 2 * cosx`);
  console.log('===============');
  console.log();

  console.log('parser test done!');
}

test();