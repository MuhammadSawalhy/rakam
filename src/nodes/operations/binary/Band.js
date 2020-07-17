﻿//import { Binary } from './Binary.js';

import Binary from './Binary.js';
export default class Band extends Binary {

    constructor(children) {
        super(children);
    }

    calculate(cs, tempVars) {
        let a = this.children[0].calculate(cs, tempVars),
            b = this.children[1].calculate(cs, tempVars);
        if (a % 1 != 0 || b % 1 != 0)
            return NaN;
        return (a & b);
    }

    toString() {
        return null;
    }
}
