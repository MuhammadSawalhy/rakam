
class Ln extends Node
{

    constructor(children)
    {
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars)
    {
        return Math.Log(this.children[0].calculate(cs, tempVars));
    }

    derivative(cs)
    {
        return new Divide(this.children[0].derivative(cs), this.children[0]);
    }

    simplify()
    {
        return new Ln(this.children[0].simplify());
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
        else if(node.type == "Log")
        {
            if (node.children[1].simplify().isEqual(new Constant(Math.E)))
                if (node.children[0].simplify().isEqual(this.children[0].simplify()))
                    return true;
        }
        return false;
    }

    toString()
    {
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ")";
    }


}
