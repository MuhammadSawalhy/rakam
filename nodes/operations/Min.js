class Min extends Node
{
    constructor(set_)
    {
        super([set_], 1);
        this.syntaxType = 'function';
        this.items = set_.items;
    }

    calculate(cs, tempVars)
    {
        let min = 0, v = 0;
        for(let i = 0; i < this.children.length; i++)
        {
            v = this.children[i].calculate(cs, tempVars);
            if (v < min)
            {
                min = v;
            }
        }
        return min;
    }

    derivative(cs)
    {
        if (this.children.length == 2)
        {
            return new If(new GreaterThan(this.children[0], this.children[1]), this.children[1].derivative(cs), this.children[0].derivative(cs));
        }
        else
        {
            return this.sub_process_1(0, cs);
        }
    }
    sub_process_1(index, cs)
    {
        if(index < this.children.length - 1)
        {
            return new If(new Equals(this, this.items[index]), this.items[index].derivative(cs), sub_process_1(index + 1, cs));
        }
        // if equals this.children.length - 1 "the last child index"
        else
        {
            return new If(new Equals(this, this.items[index]), this.items[index].derivative(cs), null);
        }
    }

    simplify()
    {
        return new Min(this.children[0].simplify());
    }

    isEqual(node)
    {
        if (fromTheSame(this, node))
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

