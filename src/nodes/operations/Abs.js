
import Node from '../Node.js';
export default class Abs extends Node {

    constructor(children)
    {
        super(children, 1)
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars)
    {
        return Math.abs(this.children[0].calculate(cs, tempVars));
    }

    derivative(cs) {
            return new Multiply(
                new If(new GreaterEquals(this.children[0], new Constant(0)),
                       new Constant(1), new Constant(-1)),
                       this.children[0].derivative(cs));
    }

    simplify()
    {
        let sChild = this.children[0].simplify();
        if (sChild instanceof Abs)
        {
            return sChild;
        }
        else if (sChild instanceof Constant)
        {
            if (sChild.value >= 0)
            {
                return sChild;
            }
            else
            {
                return new Constant(-sChild.value);
            }
        }
        return new Abs(sChild);
    }

    isEqual(node)
    {
        if (this.constructor === node.contructor)
        {
            for (let i = 0; i < this.children.length; i++)
            {
                if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
            }
            return true;
        }
        return false;
    }

    toString()
    {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }

}
