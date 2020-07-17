
import Node from '../Node.js';
export default class Sqrt extends Node {

    constructor(children)
    {
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars) {
        return this.children[0].calculate(cs, tempVars) ** 0.5;
    }

    derivative(cs)
    {
        return new Divide(this.children[0].derivative(cs), new Multiply(new Constant(2), this));
    }

    toString()
    {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }

    simplify()
    {
        return new Sqrt(this.children[0].simplify());
    }

    isEqual(node)
    {
        if(this.constructor === node.contructor)
        {
            for(let i = 0; i < this.children.length; i++)
            {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

}
