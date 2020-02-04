
import Node from '../inherited/Node.js';
class Sign extends Node {
    constructor(children){
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars) {
        return Math.sign(this.children[0].calculate(cs, tempVars));
    }

    derivative(cs) { new Constant(0) }

    simplify()
    {
        return new Sign(this.children[0].simplify());
    }

    isEqual(node)
    {
        if (fromTheSame(this, node))
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
