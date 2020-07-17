//import { Binary } from './Binary.js';

import Binary from './Binary.js';
export default class Bnot extends Binary {

    constructor(children) {
        super(children, 2);
    }

    calculate(cs, tempVars) {
        let a = this.children[0].calculate(cs, tempVars);
        if (a % 1 != 0)
            return NaN;
        return ~(a);
    }

    toString() {
        return null;
    }

}
