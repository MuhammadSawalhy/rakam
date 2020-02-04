//import { Boolean } from './Boolean.js';

import Boolean from '../../Boolean.js';
class Xor extends Boolean {

    constructor(children) {
        super(children, 2);
        this.syntaxType = 'operator';
    }

    calculate(cs, tempVars) {
        let num1 = this.children[0].calculate(cs, tempVars),
            num2 = this.children[1].calculate(cs, tempVars);
        if (isNaN(num1) || isNaN(num2)) {
            return NaN;
        }
        // here if one of the two conditions only instanceof true, 0 and 1  ,   1 and 0
        // if both are 0 or 1 the the result will be 0
        if (num1 != num2)
            return 1;
        return 0;
    }

    simplify() {
        let sChild1 = children[0].simplify(),
            sChild2 = children[1].simplify();
        if (sChild1 instanceof Not && sChild2 instanceof Not)
            return new Xor(sChild1.children[0], sChild2.children[0]);
        return new Xor(sChild1, sChild2);
    }

    isEqual(node) {
        if (fromTheSame(this, node)) {
            let sChild1 = children[0].simplify(),
                sChild2 = children[1].simplify();
            let sChild1_ = children[0].simplify(),
                sChild2_ = children[1].simplify();
            if ((sChild1.isEqual(sChild1_) && (sChild2.isEqual(sChild2_))) || (sChild1.isEqual(sChild2_) && (sChild2.isEqual(sChild1_)))) {
                return true;
            }
        }
        return false;
    }

    toString() {
        let child1 = "", child2 = "";

        if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
            child1 = this.children[0].toString();
        else
            child1 = "(" + this.children[0].toString() + ")";

        if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
            child2 = this.children[1].toString();
        else
            child2 = "(" + this.children[1].toString() + ")";


        return child1 + " xor " + child2;
    }
}
