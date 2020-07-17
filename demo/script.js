import pegjsParser from "../src/parsers/pegjs/tex.js";
import MagicalParser from "../src/parsers/MagicalParser.js";


void function sectionParser(){
    let parserInput = document.getElementById('parser-input');

    let parse = function(fn, args, divClass){
        
        let span = document.createElement('span');
        try{
            let tree, start, end;
            if(!fn){
                let tex = new tex2max();
                start = performance.now();
                tree = tex.toMaxima(...args);
                end = performance.now();
            }else if (fn == "mp"){
                let mp = new MagicalParser.CustomParsers.Math();
                start = performance.now();
                tree = mp.parse(...args);
                end = performance.now();
            }else{
                start = performance.now();
                tree = fn(...args);
                end = performance.now();
            }
            console.log(divClass + ":- - - - - - - - - - - -");
            console.log("--------------------------");
            console.log(tree);
            span.innerText = (`parsed in ${(end - start).toFixed(2)}ms`);
        } catch (e){
            span.classList.add('error');
            span.innerText = e.message;
        }
        return (span);
    }

    parserInput.addEventListener('keyup', e =>{
        console.clear();

        //////////////////
        // pegjs
        //////////////////
        let peg = parse(pegjsParser.parse, [parserInput.value], 'pegjs');


        //////////////////
        // tex2max
        //////////////////
        let texTOmax = parse(null, [parserInput.value], 'tex2max');

        //////////////////
        // magical parser
        //////////////////
        let m = parse("mp", [texTOmax.innerText], 'magical-parser');

        //////////////////
        // tex2max
        //////////////////
        let div = document.createElement('div');
        div.appendChild(peg); div.appendChild(texTOmax); div.appendChild(m);
        let parsers = document.querySelector('.parsers');
        parsers.lastElementChild.remove();
        parsers.append(div);
    });
}();

