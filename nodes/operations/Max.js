
class Max extends Node
{


    constructor(set_) {
        super([set_], 1)
        this.syntaxType = 'function';
        this.items = set_.items;
        this.children = set_;
  }

    calculate(cs, tempVars)
    {
        let max = this.items[0].calculate(cs, tempVars), v = 0;
        for (let i = 1; i < this.items.length; i++)
        {
            v = this.items[i].calculate(cs, tempVars);
            if (v > max)
            {
                max = v;
            }
        }
        return max;
    }

    derivative(cs)
    {
        if (this.children.length == 2)
        {
            return new If(new GreaterThan(this.children[0], this.children[1]), this.children[0].derivative(cs), this.children[1].derivative(cs));
        }
        else
        {
            return this.sub_process_1(0, cs);
        }
    }
    sub_process_1(index, cs)
    {
        if (index < this.children.length - 1)
        {
            return new If(new Equals(this, this.children[index]), this.children[index].derivative(cs), sub_process_1(index + 1, cs));
        }
        // if equals this.children.length - 1 "the last child index"
        else
        {
            return new If(new Equals(this, this.children[index]), this.children[index].derivative(cs), null);
        }
    }

    simplify()
    {
        return new Max(this.children[0].simplify());
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

