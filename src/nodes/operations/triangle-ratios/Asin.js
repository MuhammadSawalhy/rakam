﻿
import Node from '../../Node.js';
export default class Asin extends Node {
    constructor(children) {
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars) {
        switch (cs.angleType) {
            case 'DEG':
                return Math.asin(this.children[0].calculate(cs, tempVars)) * 180 / Math.PI;
            case 'GRAD':
                return Math.asin(this.children[0].calculate(cs, tempVars)) * 200 / Math.PI;
            default:
                return Math.asin(this.children[0].calculate(cs, tempVars));
        }
    }

    derivative(cs) {
        return new Multiply(this.children[0].derivative(cs), new Sec(this));
    }

    simplify() {
        return new Asin(this.children[0].simplify());
    }

    isEqual(node) {
        if (this.constructor === node.contructor) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

    toString() {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }

}
