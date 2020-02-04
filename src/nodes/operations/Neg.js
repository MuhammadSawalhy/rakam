
import Node from '../inherited/Node.js';
class Neg extends Node {

    constructor(children){
        super(children, 1)
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars)
    {
        return -this.children[0].calculate(cs, tempVars);
    }

    derivative(cs)
    {
        return new Neg(this.children[0].derivative(cs));
    }

    simplify()
    {
        let sChild = this.children[0].simplify();
        if(sChild instanceof Constant)
        {
            if(sChild.value === 0)
            {
                return new Constant(0);
            } 
        }
        else if (sChild instanceof Neg)
        {
            return sChild.children[0];
        }
        return new Neg(sChild);
    }

    isEqual(node)
    {
        // Here we use this.simplify() - rather than this in the if condition - as Neg(0) instanceof the same as 0 and Neg(Neg(Node) instanceof the same as Node, so after simplification it will be the same.  
        let sMe = this.simplify(),
            sNode = node.simplify();
        if (sMe.this.type === sNode.this.type)
        {
            // as it may be Constant(0) or variable ..., there will be an Exception unless we do this.
            if (sMe instanceof Variable)
            {
                if (sMe.isEqual(sNode)) return true;
            }
            else if (sMe.children != null)
            {
                for (let i = 0; i < this.children.length; i++)
                {
                    if (!this.children[i].simplify().isEqual(node.children[i].simplify())) return false;
                }
            }
            return true;
        }
        return false;
    }

    toString()
    {
        let child = "";
        if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
            child = this.children[0].toString();
        else
            child = "(" + this.children[0].toString() + ")";
        return "-" + child;
    }

}

