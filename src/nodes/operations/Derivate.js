﻿
import Node from '../Node.js';
export default class Derivate extends Node {

    constructor(expression, cs)
    {
        super(expression, 1);
        this.syntaxType = 'function';
        this.derivative = this.children[0].derivative(cs);
        this.cs = cs;
    }

    calculate(cs, tempVars)
    {
        return this.derivative.calculate(cs, tempVars);
    }

    derivative(cs)
    {
            return this.derivative.derivative(cs);
    }

    simplify()
    {
        return new Derivate(this.children[0].simplify(), this.cs);
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
        let args = "";
        for (let i = 0; i < this.children.Count(); i++)
        {
            if (args == "")
            {
                args += this.children[i].toString();
            }
            else
            {
                args += ", " + this.children[i].toString();
            }
        }
        return this.name + "(" + args + ")";
    }


}