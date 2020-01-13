class Expression{
    // for getting a node from let
    constructor(params = [], text = 'return NaN;') {
        this.node = stringTOnode(text);
        this.js = stringTOjs(params, text);
        this.toString = () => text;
    }

    eval(...params){
        return this.js(...params);
    }
}