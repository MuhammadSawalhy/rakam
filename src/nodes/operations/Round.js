
import Node from '../Node.js';
export default class Round extends Node {

    constructor(children)
    {
        super(children, 1);
        this.syntaxType = 'function';
    }

    calculate(cs, tempVars) {
        return Math.round(this.children[0].calculate(cs, tempVars));
    }

    derivative(cs)
    {
        return  new If(
                    new Equals(
                        new Mod(new Multiply(this.children[0], new Constant(2)),
                                new Constant(1)),
                        new Constant(0)),
                new Constant(NaN), new Constant(0));
    }

    simplify()
    {
        let sChild = this.children[0].simplify();

        if (sChild instanceof Floor || sChild instanceof Ceil || sChild instanceof Round)
        {
            return sChild;
        }
        if (sChild instanceof Constant) {
            return new Constant(Math.floor(sChild.value));
        }
        return new Round(sChild);
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
