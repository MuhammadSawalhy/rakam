//import { Binary } from './Binary.js';

class Bxor extends Binary
{
    constructor(children){ 
        super(children); 
    }

    calculate(cs, tempVars)
    {
        return (this.children[0].calculate(cs, tempVars) ^ this.children[1].calculate(cs, tempVars));
    }
    toString()
    {
        return null;
    }

}
