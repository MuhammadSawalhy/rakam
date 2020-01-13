
class nCr extends Node
{
    constructor(children)
    {
        super(children, 2);
        this.type = 'operator';
    }

    calculate(cs, tempVars)
    {
        return this.C_(this.children[0].calculate(cs, tempVars), this.children[1].calculate(cs, tempVars));
    }

    C_(n, k)
    {
        if (k > n)
            return 0;
        k = Math.Min(k, n - k);
        let result = 1;
        for (let d = 1; d <= k; ++d)
        {
            result *= n--;
            result /= d;
        }
        return result;
    }

    derivative(cs) { return new Constant(NaN); }

    simplify()
    {
        return new nCr(this.children[0].simplify(), this.children[1].simplify());
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


        return child1 + " C " + child2;
    }

}
