//import { Binary } from './Binary.js';

import Binary from './Binary.js';
export default class Bxor extends Binary {
    constructor(children) {
        super(children);
    }

    calculate(cs, tempVars) {
        return (this.children[0].calculate(cs, tempVars) ^ this.children[1].calculate(cs, tempVars));
    }
    toString() {
        return null;
    }

}
