
/// <summary>
/// Greatest Common Factor
/// Highest Common Factor
/// Greatest common divisor
/// Highest common divisor
///  
/// gcm, hcm, gcf, hcf, gcd, hcd
/// 
/// </summary>
import Node from '../Node.js';
export default class GCD extends Node {


    constructor(children) 
    {
        super(children, 2);
        this.syntaxType = 'function';
    }

    get items(){
        return this.children.items;
    }

    calculate(cs, tempVars)
    {
        let gcd_ = Math.abs(this.items[0].calculate(cs, tempVars));
        let a = Math.abs(this.items[1].calculate(cs, tempVars));
        if (mod(gcd_, 1) != 0 || mod(a, 1) != 0)
            return NaN;
        gcd_ = a > gcd_ ? this.gcd(a, gcd_) : this.gcd(gcd_, a);

        for (let i = 2; i < this.items.length; i++)
        {
            a = Math.round(Math.abs(this.items[i].calculate(cs, tempVars)));
            if (mod(a, 1) != 0)
                return NaN;
            gcd_ = a > gcd_ ? gcd(a, gcd_) : gcd(gcd_, a);
        }

        return gcd_;
    }
    
    /// <summary>
    /// a instanceof greater than b
    /// </summary>
    gcd(a, b)
    {
        if(b == 0 || a == 0)
        {
            return a;
        }
        else if(a == b)
        {
            return a;
        }
        else if(mod(a ,b) == 0)
        {
            return b;
        }
        else
        {
            if(a - b > b)
            {
                return gcd(a - b, b);
            }
            else
            {
                return gcd(b, a - b);
            }
        }
    }
    mod(a, b)
    {
        if (b == 0)
        {
            return NaN;
        }
        return a - b * Math.floor(a / b);
    }

    derivative(cs)
    {
        return new Constant(NaN);
    }

    simplify()
    {
        return new GCD(this.children[0].simplify());
    }

    isEqual(node)
    {
        if (this.constructor === node.contructor)
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
