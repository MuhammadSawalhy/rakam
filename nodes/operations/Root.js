
class Root extends Node
{

    constructor(children){ 
        super(children, 2); 
        this.syntaxType = 'function';
    }
    
    calculate(cs, tempVars)
    {
        return Math.pow(this.children[0].calculate(cs, tempVars), 1 / this.children[1].calculate(cs, tempVars) );
    }

    derivative(cs)
    {
        return new Subtract(
                        // the first child of the subtraction
                        new Divide(
                            new Multiply(
                                this.children[0].derivative(cs),
                                new Power(this.children[0], new Divide(new Subtract(new Constant(1), this.children[1]), this.children[1]))
                                ),
                            this.children[1]),
                    
                        // the second child of the subtraction
                        new Divide(
                            new Multiply(
                                this.children[1].derivative(cs),
                                new Multiply(
                                    this,
                                    new Ln(new Abs(this.children[0]))
                                    )
                                ),
                            new Power(
                                this.children[1],
                                new Constant(2)
                                )
                            )
            );
    }

    simplify()
    {
        return new Root(this.children[0].simplify(), this.children[1].simplify());
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
        return this.type.toLowerCase() + "(" + this.children[0].toString() + ", " + this.children[1].toString() + ")";
    }

}
