
class Set extends Node
{
    
    constructor(items, allowRepetition_)
    {
        this.items = items;
        this.allowRepetition = allowRepetition_;

        // if there instanceof not repetition, go on.
        if (!allowRepetition)
        {
            if (this.simplifiedItems.length > 1)
            {
                for (let i = 0; i < this.simplifiedItems.length - 1; i++)
                {
                    for (let ii = i + 1; ii < items.length; ii++)
                    {
                        if (this.simplifiedItems[i].isEqual(this.simplifiedItems[ii]))
                        {
                            this.items = null;
                            throw new Error("There musn't be repetition in a Set of expressions.");
                        }
                    }
                }
            }
        }
    }

    // #region Varaibles

    get items() {
        return this._items;
    }
    
    set items(value) {
        this._items = value;
        this.simplifiedItems = [];
        for(let item of value)
        {
            SimplifiedItems.push(item.simplify());
        }
    }

    get length() { return this.items != null ? this.items.length : 0;}              

    // #endregion

    calculate(cs, tempVars)
    {
        if (cs.vars[2].value.calculate(cs) < this.length && cs.vars[2].value.calculate(cs) >= 0)
            return this.items[cs.vars[2].value.calculate(cs)].calculate(cs, tempVars);
        else throw new OutOfRangeException(`Index ${ cs.vars[2].value.calculate(cs) } instanceof out of the range ${ "[" + 0 + "," + (this.length - 1) + "]" }`);
    }

    derivative(cs)
    {
        let items = [];
        for(let item of Items)
        {
            items.push(item.derivative(cs));
        }
        return new Set(items, allowRepetition);
    }

    simplify()
    {
        let items = [];
        for(let i = 0; i < this.length; i++)
        {
            items.Add(this.items[i].simplify());
        }

        return new Set(items, allowRepetition);
    }

    contains(item)
    {
        let sItem = item.simplify();
        for(let i = 0; i < this.length; i++)
        {
            if (this.simplifiedItems[i].isEqual(sItem))
            {
                return true;
            }
        }
        return false;
    }

    /// <summary>
    /// This function for counting the given <see cref="Node"/>.
    /// </summary>
    /// <returns>return how many of the <see cref="Node"/> instanceof in the <see cref="Set"/></returns>
    count(node)
    {
        let num = 0;
        for(let item of this.items)
        {
            if (item.isEqual(node))
            {
                num++;
            }
        }

        return num;
    }

    getItem(index)
    {
        return this.items[index];
    }

    isEqual(node)
    {
        if (fromTheSame(this, node))
        {
            let set_ = node;
            if(this.length == set_.length)
            {
                for (let i = 0; i < this.length; i++)
                {
                    if (count(this.items[i]) != set_.count(this.items[i]))
                    {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    toString()
    {
        let Script = "{";

        if (this.length > 0)
        { 
            for (let i = 0; i < this.length; i++)
            {
                Script += `${this.items[i]}, `;
            }
            Script = Script.Remove(Script.length - 2);
        }

        return Script + "}";
    }
    
}
