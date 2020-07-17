
    
import Node from '../Node.js';
export default class Log extends Node {
    constructor(children)
    {
        super(children, 2)
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars)
    {
        return Math.Log(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
    }

    derivative(cs)
    {
            return new Multiply(new Log(new Constant(Math.E) , this.children[1]), new Divide(this.children[0].derivative(cs), this.children[0]));
    }

    simplify()
    {
        return new Log(this.children[0].simplify(), this.children[1].simplify());
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
        else if (node.type == "Ln")
        {
            if (this.children[1].simplify().isEqual(new Constant(Math.E)))
                if (this.children[0].simplify().isEqual(node.children[0].simplify()))
                    return true;
        }
        return false;
    }

    toString()
    {
        if (this.children[1] instanceof Constant && this.children[1].value == 10)
        {
            return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
        }
        else if (this.children[1] instanceof Constant && children[1].value == Math.E)
        {
            return "ln(" + this.children[1].toString() + ")";
        }
        else
            return this.type.toLowerCase() + "(" + this.children[0].toString() + ", " + this.children[1].toString() + ")";
    }
}
