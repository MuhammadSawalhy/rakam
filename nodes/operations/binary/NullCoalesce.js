//import { Binary } from './Binary.js';

class NullCoalesce extends Binary
{

    constructor(children){ 
        super(children); 
    }

    calculate(cs, tempVars)
    {
        var a2 = this.children[0].calculate(cs, tempVars);
        return isNaN(a2) || !isFinite(a2) ? 
            this.children[1].calculate(cs, tempVars) :
            a2;
    }
    toString()
    {
        return null;
    }

}

