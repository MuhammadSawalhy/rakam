
class Mod extends Node
{

    constructor(children)
    {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars)
    {
        return this.mod(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
    }

    mod(a, b)
    {
        return a - b * Math.floor(a / b);
    }

    derivative(cs)
    {
        return new Subtract(
            this.children[0].derivative(cs),
            new Multiply(this.children[1].derivative(cs), new Floor(new Divide(this.children[0], this.children[1])))
            );
    }

    simplify()
    {
        return new Mod(this.children[0].simplify(), this.children[1].simplify());
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
        let child1 = "", child2 = "";

        if (this.children[0].syntaxType == 'literal' || this.children[0].syntaxType == 'function')
            child1 = this.children[0].toString();
        else
            child1 = "(" + this.children[0].toString() + ")";

        if (this.children[1].syntaxType == 'literal' || this.children[1].syntaxType == 'function')
            child2 = this.children[1].toString();
        else
            child2 = "(" + this.children[1].toString() + ")";


        return child1 + " mod " + child2;
    }
}
