
import Node from '../Node.js';
export default class Constrain extends Node {
    constructor(children)
    {
        super(children, 3);
        this.syntaxType = 'function';
        this.num = new Array(3).fill(0);
    }

    calculate(cs, tempVars)
    {
        this.num[0] = this.children[0].calculate(cs, tempVars);
        this.num[1] = this.children[1].calculate(cs, tempVars);
        this.num[2] = this.children[2].calculate(cs, tempVars);
        if(num[1] <= num[2])
        {
            return Math.Min(Math.Max(num[1], num[0]), num[2]);
        }
        else
        {
            return num[0];
        }
    }

    derivative(cs)
    {
        return new Constrain([ this.children[0].derivative(cs), this.children[1], this.children[2] ]);
    }

    simplify()
    {
        return new Constrain([ this.children[0].simplify(), this.children[1].simplify(), this.children[2].simplify() ]);
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
        return false;
    }

    toString()
    {
        return this.type.toLowerCase() + "(" + this.children[0].toString()  + ")";
    }

}
