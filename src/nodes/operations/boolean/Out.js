//import { Boolean } from './Boolean.js';

import Boolean from '../../Boolean.js';
class Out extends Boolean {

    /// <summary>
    /// this.children:
    /// this.children[0] instanceof the bounded value it self.
    /// this.children[1] and this.children[2] are the boundaries.
    /// </summary>
    /// <param name="children">the length instanceof 3 .</param>

    constructor(children) {
        super(children, 3);
        this.syntaxType = 'function';
    }

    betWeen(cs, tempVars) {
        return this.children[0].calculate(cs, tempVars) >= this.children[1].calculate(cs, tempVars) && this.children[0].calculate(cs, tempVars) <= this.children[2].calculate(cs, tempVars);
    }

    ///// if (this.children[1] > this.children[0] > this.children[2]) return 1, otherwise return 0;
    calculate(cs, tempVars) {
        if (!this.betWeen(cs, tempVars))
            return 1;
        return 0;
    }

    simplify() {
        let sChild1 = this.children[0].simplify(),
            sChild2 = this.children[1].simplify(),
            sChild3 = this.children[2].simplify();
        return new Out([sChild1, sChild2, sChild3]);
    }

    isEqual(node) {
        if (fromTheSame(this, node)) {
            let sChild1 = this.children[0].simplify(),
                sChild2 = this.children[1].simplify(),
                sChild3 = this.children[2].simplify();
            let sChild1_ = this.children[0].simplify(),
                sChild2_ = this.children[1].simplify(),
                sChild3_ = this.children[2].simplify();
            if (sChild1.isEqual(sChild1_) &&
                sChild2.isEqual(sChild2_) &&
                sChild3.isEqual(sChild3_)) {
                return true;
            }
        }
        return false;
    }

    toString() {
        return null;
    }

}
