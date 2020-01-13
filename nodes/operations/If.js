
class If extends Node
{

    /**
     * condition, iftrue, iffalse
     */
    constructor()
    {
        super([condition, iftrue, iffalse], 3)
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars)
    {
        let condition = this.children[0].calculate(cs, tempVars);
        if(isNaN(condition))
            return NaN;
        if (condition == 1)
        {
            return this.children[1].calculate(cs, tempVars);
        }
        else if (this.children[2] != null)
        {
            return this.children[2].calculate(cs, tempVars);
        }
        return NaN;
    }

    derivative(cs)
    {
            if (this.children[2] != null)
                return new If(this.children[0], this.children[1].derivative(cs), this.children[2].derivative(cs));
            else
                return new If(this.children[0], this.children[1].derivative(cs), null);
    }

    simplify()
    {
        return new If(this.children[0].simplify(), this.children[1].simplify(), this.children[2].simplify());
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
        if (this.children[2])
            return `if(${this.children[0]}, ${this.children[1]}, ${this.children[2]})`;
        else
            return `if(${this.children[0]}, ${this.children[1]})`;
    }

}