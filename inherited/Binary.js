//import { Node } from './../../Node.js';

class Binary extends Node
{

    constructor(children){
        super(children, 2); 
        this.syntaxType = 'function';
    }


    calculate(cs, tempVars)
    {
        return NaN;
    }

    derivative(cs)
    {
        throw new NotImplementedException();
    }

    simplify()
    {
        throw new NotImplementedException();
    }

    isEqual(node)
    {
        throw new NotImplementedException();
    }

}
