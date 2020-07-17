
import Node from '../Node.js';
export default class LCM extends Node {
    constructor(children){
        super(children, 0);
        this.syntaxType = 'function';
        this.GCD = new GCD(children[0]);
    }
    get items() {
        return this.children.items;
    }

    calculate(cs, tempVars)
    {
        let product = 1;
        let a;
        for(let i = 0; i < this.items.length; i++)
        {
            a = this.items[i].calculate(cs, tempVars);
            if (mod(a, 1) != 0)
                return NaN;
            product *= a;
        }
        return Math.abs(product) / Math.pow(this.GCD.calculate(cs, tempVars), this.items.length - 1);
    }
    mod(a, b)
    {
        if (b == 0)
        {
            return NaN;
        }
        return a - b * Math.floor(a / b);
    }

    derivative(cs)
    {
        return new Constant(NaN);
    }

    simplify()
    {
        return new LCM(this.children[0].simplify());
    }

    isEqual(node)
    {
        if (this.constructor === node.contructor)
        {
            if (this.children[0].isEqual(node.children[0]))
                return true;
        }
        return false;
    }

    toString()
    {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }

}
